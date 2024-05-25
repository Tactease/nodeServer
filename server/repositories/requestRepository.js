const { MongoStorage } = require('../data/mongoStorage');

const mongoStorage = new MongoStorage('request');

const findRequests = () => mongoStorage.find();

const findSoldierRequests = (soldierId) => mongoStorage.findRequests(soldierId);

const retrieveRequest = (id) => mongoStorage.retrieve({ _id: id });

const createRequest = (id, request) => mongoStorage.createRequest(id, request);

const updateRequest = (id, request) => mongoStorage.updateRequest({ _id: id }, request);

const deleteRequest = (request) => mongoStorage.delete(request);

module.exports = {
  findRequests, findSoldierRequests, retrieveRequest, createRequest, updateRequest, deleteRequest,
};
