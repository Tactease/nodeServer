/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const {
  findMissions,
  retrieveMission,
  createMission,
  createMissions,
  updateMission,
  deleteMission,
  findMissionsByClassId
} = require('../repositories/missionsRepository');
const {
  EntityNotFoundError,
  BadRequestError
} = require('../errors/errors');

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

  async getMissionsByClassId(classId, next) {
    try {
      return await findMissionsByClassId({ classId: classId });
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
      const mission = await updateMission();
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
      const mission = await deleteMission();
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
      let isValid = true;
      missions.forEach((mission) => {
        if (!mission.classId || !mission.missionType || !mission.startDate || !mission.endDate || !mission.soldierCount) {
          isValid = false;
        }
      });
      return isValid;
    } else {
      return !(!missions.classId || !missions.missionType || !missions.startDate || !missions.endDate || !missions.soldierCount);
    }
  }
};
