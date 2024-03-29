const { MongoStorage } = require('../data/mongoStorage');

const storage = new MongoStorage('mission');
const findMissions = () => storage.find({});

const retrieveMission = (id) => storage.retrieve({ _id: id });

const createMission = (mission) => storage.create(mission);

const createMissions = (mission) => storage.createMany(mission);

const updateMission = (id, mission) => storage.update({ _id: id }, mission);

const deleteMission = (id) => storage.delete({ _id: id });

module.exports = {
  findMissions, retrieveMission, createMission, createMissions, updateMission, deleteMission,
};
