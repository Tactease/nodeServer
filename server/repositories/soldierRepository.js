const { MongoStorage } = require('../data/mongoStorage');
const { DuplicateError } = require('../errors/errors');

const mongoStorage = new MongoStorage('soldier');

const findSoldiers = () => mongoStorage.find({});

const retrieveSoldier = (id) => mongoStorage.retrieve({ _id: id });

const retrieveSoldierByClass = (id) => mongoStorage.retrieveByClass({ 'depClass.classId': id });

const createSoldier = async (soldier) => {
  try {
    return await mongoStorage.create(soldier);
  } catch (error) {
    throw new DuplicateError('Soldier');
  }
};

const updateSoldier = (id, soldier) => mongoStorage.update({ _id: id }, soldier);

const deleteSoldier = (id) => mongoStorage.delete({ _id: id });

const createRequest = (id, request) => mongoStorage.createRequest(id, request);

const deleteRequest = (id, request) => mongoStorage.deleteRequest(id, request);

// eslint-disable-next-line max-len
const updateRequest = (solderId, requestId, data) => mongoStorage.updateRequest(solderId, requestId, data);

const retrieveSoldierByPN = (personalNumber) => mongoStorage.retrieveByPN({ personalNumber });

module.exports = {
  // eslint-disable-next-line max-len
  findSoldiers, retrieveSoldier, createSoldier, updateSoldier, deleteSoldier, retrieveSoldierByClass, createRequest, deleteRequest, updateRequest, retrieveSoldierByPN,
};
