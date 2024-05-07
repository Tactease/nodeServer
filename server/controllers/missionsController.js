/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const {
  findMissions,
  retrieveMission,
  createMission,
  createMissions,
  updateMission,
  deleteMission,
  findMissionsByClassId,
  findMissionsByQuery,
} = require('../repositories/missionsRepository');
const {
  EntityNotFoundError,
  BadRequestError
} = require('../errors/errors');
const moment = require('moment');

exports.missionsController = {
  async getMissions(req, res, next) {
    try {
      const missions = await findMissions();
      if (!missions || missions.length === 0) throw new EntityNotFoundError('missions');
      res.status(200)
        .json(missions);
    } catch (error) {
      next(error);
    }
  },

  async getClassMissions(req, res, next){
    try {
      const { classId } = req.params;
      const mission = await findMissionsByClassId({ classId: classId });
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Missions with class id <${classId}>`);
      res.status(200)
        .json(mission);
    } catch (error) {
      next(error);
    }
  },

  async getMissionsByClassId(classId, next) {
    try {
      return await findMissionsByClassId({ classId: classId });
    } catch (error) {
      next(error);
    }
  },

  async getMissionsByClassIdAndDate(classId, next) {
    try {
      const oneWeekAgo = moment()
        .subtract(1, 'weeks')
        .toISOString();
      const query = {
        classId: classId,
        startDate: { $gte: oneWeekAgo }
      };
      return await findMissionsByQuery(query);
    } catch (error) {
      next(error);
    }
  },

  async getMissionByID(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      const mission = await retrieveMission(missionId);
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Mission with id <${missionId}>`);
      res.status(200)
        .json(mission);
    } catch (error) {
      next(error);
    }
  },
  async addMission(result) {
    try {
      if (Object.keys(result).length === 0) throw new BadRequestError('create');
      if (Array.isArray(result)) {
        return await createMissions(result);
      } else {
        return await createMission(result);
      }
    } catch (error) {
      throw error;
    }
  },
  async updateMission(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      if (Object.keys(req.body).length === 0) throw new BadRequestError('update');
      const mission = await updateMission(missionId, req.body);
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(200)
        .json(mission);
    } catch (error) {
      next(error);
    }
  },
  async deleteMission(req, res, next) {
    try {
      const { missionId } = req.params;
      const isId = mongoose.isValidObjectId(missionId);
      if (!isId) throw new BadRequestError('id');
      const mission = await deleteMission(missionId);
      if (!mission || mission.length === 0) throw new EntityNotFoundError(`Request with id <${missionId}>`);
      res.status(200)
        .json(mission);
    } catch (error) {
      if (error.name === 'ValidationError') {
        error.status = 400;
      }
      next(error);
    }
  },

  async validateMissions(missions) {
    if (Array.isArray(missions)) {
      return missions.every((mission) => {
        return validateMission(mission);
      });
    } else {
      return validateMission(missions);
    }
  }
};

const validateMission = (mission) => {
  let isValid = true;

  if (!mission.classId || !mission.missionType || !mission.startDate || !mission.endDate || !mission.soldierCount) {
    isValid = false;
  }

  const startDate = moment(mission.startDate, 'DD/MM/YYYY HH:mm'); // Update format to 'HH:mm'
  const endDate = moment(mission.endDate, 'DD/MM/YYYY HH:mm'); // Update format to 'HH:mm'
  const currDate = moment.utc().local();

  if (startDate.isBefore(currDate)) {
    isValid = false;
  }

  if (endDate.isBefore(startDate)) {
    isValid = false;
  }

  if (mission.soldierCount <= 0) {
    isValid = false;
  }

  return isValid;
};
