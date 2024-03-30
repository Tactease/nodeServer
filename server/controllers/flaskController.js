const {
  FlaskConnection
} = require('../errors/errors');
const axios = require('axios');

exports.flaskController = {
  async flaskConnection(requestString, data) {
    const flaskApiUrl = `http://localhost:5000/${requestString}`;
    let payload = {
      missions: JSON.stringify(data.missions),
      soldiers: JSON.stringify(data.soldiers)
    };

    if (requestString === 'add_mission') {
      payload = {
        schedule: JSON.stringify(data.schedule),
        new_mission: JSON.stringify(data.new_mission),
        soldiers: JSON.stringify(data.soldiers)
      };
    }

    return await axios.post(flaskApiUrl, payload);
  },
}
