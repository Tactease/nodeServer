const { MongoStorage } = require('../data/mongoStorage');

const mongoStorage = new MongoStorage('mission');
const findMissions = () => mongoStorage.find({});

const findMissionsByClassId = (classId) => mongoStorage.retrieveByClass(classId);

const findMissionsByQuery = (query) => mongoStorage.retrieveMany(query);

const retrieveMission = (id) => mongoStorage.retrieve({ _id: id });

const createMission = (mission) => mongoStorage.create(mission);

const createMissions = (mission) => mongoStorage.createMany(mission);

const updateMission = (id, mission) => mongoStorage.update({ _id: id }, mission);

const deleteMission = (id) => mongoStorage.delete({ _id: id });

module.exports = {
  findMissions,findMissionsByClassId, retrieveMission, createMission, createMissions, updateMission, deleteMission, findMissionsByQuery
};
