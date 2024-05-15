const {
  FlaskConnection
} = require('../errors/errors');
const axios = require('axios');

localURL = 'http://localhost:5000/';
rendeURL = 'https://tacteasepythonserver.onrender.com/';

exports.flaskController = {
  async flaskConnection(requestString, data) {
    const flaskApiUrl = `${localURL}${requestString}`;
    let payload = {};

    if (requestString === 'generae_schedule') {
      payload = {
        missions: JSON.stringify(data.missions),
        soldiers: JSON.stringify(data.soldiers)
      };
    }

    if (requestString === 'add_mission') {
      payload = {
        schedule: JSON.stringify(data.schedule),
        new_mission: JSON.stringify(data.new_mission),
        soldiers: JSON.stringify(data.soldiers)
      };
    }

    if (requestString === 'change_soldier_upon_request_approved') {
      payload = {
        request_approved: JSON.stringify(data.request_approved),
        missions: JSON.stringify(data.missions),
        soldiers: JSON.stringify(data.soldiers)
      };
    }

    try {
      return await axios.post(flaskApiUrl, payload);
    } catch (error) {
      throw new FlaskConnection(flaskApiUrl);
    }
  },
}
