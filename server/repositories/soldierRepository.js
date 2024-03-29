const { MongoStorage } = require('../data/mongoStorage');
const { DuplicateError } = require('../errors/errors');

const storage = new MongoStorage('soldier');

const findSoldiers = () => storage.find({});

const retrieveSoldier = (id) => storage.retrieve({ _id: id });

const retrieveSoldierByClass = (id) => storage.retrieveByClass({ 'depClass.classId': id });

const createSoldier = async (soldier) => {
  try {
    return await storage.create(soldier);
  } catch (error) {
    throw new DuplicateError('Soldier');
  }
};

const updateSoldier = (id, soldier) => storage.update({ _id: id }, soldier);

const deleteSoldier = (id) => storage.delete({ _id: id });

const createRequest = (id, request) => storage.createRequest(id, request);

const deleteRequest = (id, request) => storage.deleteRequest(id, request);

// eslint-disable-next-line max-len
const updateRequest = (solderId, requestId, data) => storage.updateRequest(solderId, requestId, data);

const retrieveSoldierByPN = (personalNumber) => storage.retrieveByPN({ personalNumber });

module.exports = {
  // eslint-disable-next-line max-len
  findSoldiers, retrieveSoldier, createSoldier, updateSoldier, deleteSoldier, retrieveSoldierByClass, createRequest, deleteRequest, updateRequest, retrieveSoldierByPN,
};
