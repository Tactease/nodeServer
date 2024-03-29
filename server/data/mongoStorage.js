const { EventEmitter } = require('events');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Path = require('path');

dotenv.config();

const connect = () => {
  const connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
  mongoose
    .connect(connectionUrl)
    .then(() => console.log('connected to Tactease DB'))
    .catch((err) => console.log(`connection error: ${err}`));
};

class MongoStorage extends EventEmitter {
  constructor(entity) {
    super();

    this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
    this.Model = require(Path.join(__dirname, `../models/${this.entityName}Model.js`));
  }

  find() {
    return this.Model.find();
  }

  findRequests(soldierId) {
    return this.Model.find({ soldierId });
  }

  retrieve(id) {
    return this.Model.findOne(id);
  }

  retrieveByClass(id) {
    return this.Model.find(id);
  }

  create(data) {
    return this.Model.create(data);
  }

  createMany(data) {
    return this.Model.insertMany(data);
  }

  delete(id) {
    return this.Model.findByIdAndDelete(id);
  }

  update(id, data) {
    return this.Model.findOneAndUpdate(id, data, { new: true });
  }

  createRequest(id, data) {
    return this.Model.findOneAndUpdate(
      { _id: id },
      { $push: { requestList: data } },
      { new: true, useFindAndModify: false },
    );
  }

  updateRequest(solderId, requestIndex, data) {
    return this.Model.findOneAndUpdate(
      { _id: solderId },
      { $set: { [`requestList.${requestIndex}`]: data } },
      { new: true, useFindAndModify: false },
    );
  }

  deleteRequest(id, data) {
    return this.Model.findOneAndUpdate(
      { _id: id },
      { $pull: { requestList: data } },
      { new: true, useFindAndModify: false },
    );
  }

  retrieveByPN(personalNumber) {
    return this.Model.findOne(personalNumber);
  }
}

module.exports = { MongoStorage, connect };
