const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { missionsController } = require('../controllers/missionsController');

exports.algorithmController = {
  async flaskConnection(requestString, newMission, soldiers) {
    const flaskApiUrl = `http://localhost:5000/${requestString}`;
    try {
      let payload;
      if (requestString === 'generateSchedule') {
        payload = { missions: JSON.stringify([newMission]), soldiers: JSON.stringify(soldiers) };
      } else if (requestString === 'add_mission') {
        payload = { schedule: JSON.stringify({}), new_mission: JSON.stringify(newMission), soldiers: JSON.stringify(soldiers) };
      } else {
        throw new Error('Invalid requestString provided to flaskConnection');
      }

      const response = await axios.post(flaskApiUrl, payload);
      return response.data;
    } catch (error) {
      console.error(`Error connecting to Flask API at ${flaskApiUrl}:, error.message`);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
  async middleWare(req, res, next) {
    try {
      const missions = await missionsController.getMissions();
      if (!Array.isArray(req.body)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Expected an array of missions in the request body.' });
      }
      const processedMissions = req.body.map((mission, index) => ({ ...mission, _id: index }));
      if (!missions) {
        const result = await this.flaskConnection('generate_schedule', processedMissions);
        res.status(200).json(result);
      }
      else {
        const result = await this.flaskConnection('add_mission', processedMissions);
        res.status(200).json(result);
      }
    }
    catch (error) {
      next(error);
    }
  },
}
