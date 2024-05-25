const axios = require('axios');
const { missionsController } = require('../controllers/missionsController');
const { soldiersController } = require('../controllers/soldierController');
const { requestsController } = require('../controllers/requestController');
const {
  retrieveSoldier,
} = require('../repositories/soldierRepository');

const {
  flaskController
} = require('../controllers/flaskController');
const {
  FlaskResponse,
  EntityNotFoundError,
  BadRequestError,
  NotFoundSchedule
} = require('../errors/errors');
const moment = require('moment');
const { reject } = require('bcrypt/promises');

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 404) {
        throw new NotFoundSchedule(error.response.data.message, statusCode);
      }
      throw new FlaskResponse(error.response.data.message, statusCode);
    }
  }
);

const processMissions = (missions) => {
  let processedMissions = [];
  if (Array.isArray(missions)) {
    processedMissions = missions.map((mission, index) => ({
      ...mission,
      _id: index
    }));
  } else {
    processedMissions = [{
      ...missions,
      _id: 0
    }];
  }
  return processedMissions;
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

exports.algorithmHandler = {
  async newMissionsMiddleware(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) throw new BadRequestError('add missions');

      const validation = await missionsController.validateMissions(req.body);
      if (!validation) throw new BadRequestError('missing or invalid arguments for missions');

      let processedMissions = processMissions(req.body);

      const classId = processedMissions[0].classId;

      const soldiers = await soldiersController.getSoldiersByClassId(classId, next);
      if (!soldiers) throw new EntityNotFoundError(`couldn't find solider for classId ${classId} `);
      const shuffledSoldiers = shuffle(soldiers);

      const missions = await missionsController.getMissionsByClassId(classId, next);

      let url = 'generate_schedule';
      let data = {
        'missions': processedMissions,
        'soldiers': shuffledSoldiers
      };

      const minNewMissionDate = processedMissions.reduce((acc, curr) => {
        if (acc.startDate < curr.startDate) {
          return acc;
        }
        return curr;
      }, processedMissions[0]).startDate;


      const maxCurrMissionDate = missions.reduce((acc, curr) => {
        if (!acc || moment(acc, 'DD/MM/YYYY HH:mm').isBefore(moment(curr.startDate, 'DD/MM/YYYY HH:mm'))) {
          return curr.startDate;
        }
        return acc;
      }, null);

      const minNewMissionMoment = moment(minNewMissionDate, 'DD/MM/YYYY HH:mm');
      const maxCurrMissionMoment = moment(maxCurrMissionDate, 'DD/MM/YYYY HH:mm');

      const isTwoDaysAfter = minNewMissionMoment.diff(maxCurrMissionMoment, 'days') > 2;

      if (missions.length > 0 && !isTwoDaysAfter) {
        url = 'add_mission';
        data = {
          'schedule': missions,
          'new_mission': processedMissions,
          'soldiers': shuffledSoldiers
        };
      }

      const result = await flaskController.flaskConnection(url, data);
      const resData = JSON.parse(result.data);
      console.log(result.data);
      if (!resData || resData === 0) throw new BadRequestError('schedule');
      if (resData.hasOwnProperty('error')) throw new NotFoundSchedule(`${resData.error}`);

      const missionResult = await missionsController.addMission(resData);
      res.status(200)
        .json(missionResult);

    } catch (error) {
      next(error);
    }
  },

  async changeScheduleBySoldierRequest(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) throw new BadRequestError('update request');

      const soldier = await retrieveSoldier(req.soldierId);
      if (!soldier || soldier.length === 0) throw new EntityNotFoundError(`Soldier with id <${req.soldierId}>`);
      const classId = soldier.depClass.classId;

      const { requestId } = req.params;
      if (!requestId || isNaN(requestId)) throw new BadRequestError('id');

      const request = req.body.request;

      if (request['status'] !== 'Approved' && request['status'] !== 'Rejected') throw new BadRequestError('status');

      if (request['status'] === 'Approved') {
        const soldiers = await soldiersController.getSoldiersByClassId(classId, next);
        if (!soldiers) throw new EntityNotFoundError(`couldn't find solider for classId ${classId} `);

        const shuffledSoldiers = shuffle(soldiers);

        const missions = await missionsController.getMissionsByClassId(classId, next);
        const url = 'update_schedule';
        const requestApprove = {
          'personalNumber': soldier.personalNumber,
          'index': parseInt(requestId)
        };

        const data = {
          'request_approved': requestApprove,
          'missions': missions,
          'soldiers': shuffledSoldiers
        };

        const result = await flaskController.flaskConnection(url, data);
        const resData = JSON.parse(result.data);

        if (!resData || resData === 0 || resData.length === 0) throw new NotFoundSchedule(`${resData.message}`);

        if (resData.hasOwnProperty('error') || resData['message'] === 'No suitable replacement found.') {
          let rejected = request;
          rejected.status = 'Rejected';
          const rejectReq = await requestsController.updateRequest(req.soldierId, parseInt(requestId), rejected);
          throw new BadRequestError(`${resData.error}`);
        }

        const missionResult = await missionsController.updateMissionsAfterRequest(resData);

        const updatedRequest = await requestsController.updateRequest(req.soldierId, parseInt(requestId), request);

        const updatedData = {
          missionResult,
          updatedRequest
        }
        res.status(200).json(updatedData);
      } else {
        const updatedRequest = await requestsController.updateRequest(req.soldierId, parseInt(requestId), request);
        res.status(200).json(updatedRequest);
      }
    } catch (error) {
      next(error);
    }
  },
};
