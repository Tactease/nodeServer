const { Router } = require('express');
const { missionsController } = require('../controllers/missionsController');
const {algorithmHandler} = require('../middlewares/algorithmHandler');

const missionsRouter = new Router();

missionsRouter.get('/', missionsController.getMissions);
missionsRouter.get('/list/:classId', missionsController.getClassMissions);
missionsRouter.get('/:missionId', missionsController.getMissionByID);
missionsRouter.post('/', algorithmHandler.newMissionsMiddleware);
missionsRouter.put('/:missionId', missionsController.updateMission);
missionsRouter.delete('/:missionId', missionsController.deleteMission);

module.exports = { missionsRouter };
