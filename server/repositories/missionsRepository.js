const { MongoStorage } = require('../data/mongoStorage');

const storage = new MongoStorage('mission');
const findMissions = () => storage.find({});

const findMissionsByClassId = (classId) => mongoStorage.retrieveByClass(classId);

const retrieveMission = (id) => mongoStorage.retrieve({ _id: id });

const createMission = (mission) => storage.create(mission);

const createMissions = (mission) => storage.createMany(mission);

const updateMission = (id, mission) => storage.update({ _id: id }, mission);

const deleteMission = (id) => storage.delete({ _id: id });

module.exports = {
  findMissions,findMissionsByClassId, retrieveMission, createMission, createMissions, updateMission, deleteMission,
};
