const axios = require('axios');
const { missionsController } = require('../controllers/missionsController');
const { soldiersController } = require('../controllers/soldierController');
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

exports.algorithmHandler = {
  async algMiddleware(req, res, next) {
    try {
      if (Object.keys(req.body).length === 0) throw new BadRequestError('add missions');

      const validation = await missionsController.validateMissions(req.body);
      if (!validation) throw new BadRequestError('missing or invalid arguments for missions');

      let processedMissions = processMissions(req.body);

      const classId = processedMissions[0].classId;

      const soldiers = await soldiersController.getSoldiersByClassId(classId, next);

      if (!soldiers) throw new EntityNotFoundError(`couldn't find solider for classId ${classId} `);

      const missions = await missionsController.getMissionsByClassId(classId, next);

      let url = 'generate_schedule';
      let data = {
        'missions': processedMissions,
        'soldiers': soldiers
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
          'soldiers': soldiers
        };
      }

      const result = await flaskController.flaskConnection(url, data);
      const resData = JSON.parse(result.data);
      if (!resData || resData === 0) throw new BadRequestError('schedule');
      if (resData.hasOwnProperty('error')) throw new NotFoundSchedule(`${resData.error}`);

      const missionResult = await missionsController.addMission(resData);
      res.status(200)
        .json(missionResult);

    } catch (error) {
      next(error);
    }
  },
};
