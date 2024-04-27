const { Schema, model } = require('mongoose');

const MissionSchema = new Schema({
  classId: { type: Number, required: true },
  missionType: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  soldierCount: { type: Number, required: true },
  soldiersOnMission: { type: Array },
}, { collection: 'missions' });

MissionSchema
  .path('endDate')
  .validate(((value) => this.startDate && value && value < this.startDate));

MissionSchema
  .path('soldierCount')
  .validate(((value) => value > 0));

module.exports = model('mission', MissionSchema);
