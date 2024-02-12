use tactease_test1 // Replace 'yourdatabase' with the actual name of your database
print("DB acquired");

//Should we reset the DB?
const do_reset = 1;

if(do_reset){
// Drop collections if they exist
db.soldiers.drop();
db.classes.drop();
db.pakals.drop();
db.requestTypes.drop();
db.daysOffTypes.drop();
db.missions.drop();
print("RESET - previous collections dropped");

print("RESET DONE");
}

// 1) Create collections
db.createCollection("soldiers");
db.createCollection("classes");
db.createCollection("pakals");
db.createCollection("requestTypes");
db.createCollection("daysOffTypes");
db.createCollection("missions");
print("collections created");

// 2) Add 3 classObj's
var classAId = db.classes.insertOne({ classNumber: 101, className: 'ClassA' }).insertedId;
var classBId = db.classes.insertOne({ classNumber: 102, className: 'ClassB' }).insertedId;
var classCId = db.classes.insertOne({ classNumber: 103, className: 'ClassC' }).insertedId;
print("classObj's created");

// 3) Add 2 PAKAL's and request data
db.pakals.insertMany([
  { pakal: 'Driver' },
  { pakal: 'Engineer' },
]);
print("pakals created");

db.requestTypes.insertMany([
  { type: 'TypeX' },
  { type: 'TypeY' },  
  { type: 'Day Off' },
]);
print("request Types created");

db.daysOffTypes.insertMany([
  { type: 'TypeX' },
  { type: 'TypeY' },
  { type: 'Regular' },
]);
print("days Off Types created");

//Soldier var's to input
var setPerNum = 1;
var setfullName = 'John Doe';
var setClass = 'ClassA';
var setPakal = 'Driver';
var setRequest = 'TypeX';
var setDayoff = 'TypeY';
print("setVar's created, checking if valid...");
// 4) Attempt to add 1 Soldier
var validClass = db.classes.findOne({ className: setClass });
print("Class checked...");
var validPAKAL = db.pakals.findOne({ pakal: setPakal });
print("Pakal checked...");
var validRequestType = db.requestTypes.findOne({ type: setRequest });
print("Request checked...");
var validDayOffType = db.daysOffTypes.findOne({ type: setDayoff });
print("Dayoff checked...");

if (validClass && validPAKAL && validRequestType && validDayOffType) {
  print("Validations successful, adding soldier...");
  // Validations successful, add soldier
  db.soldiers.insertOne({
    personal_number: setPerNum,
    fullName: setfullName,
    PAKAL: setPakal,
    class: setClass,
    requests: [
      {
        requestType: setRequest,
        daysOffType: setDayoff,
        start_date: ISODate('2024-01-31'),
        end_date: ISODate('2024-02-07'),
      }
      // Add other Request objects as needed
    ],
  });

  print("Soldier added successfully.");
} else {
  print("Validation failed. Soldier not added.");
}

// Function to add a new soldier
function addSoldier(personal_number, fullName) {
  db.soldiers.insertOne({
      personal_number: personal_number,
      fullName: fullName,
  });
  print("Soldier added successfully.");
}

// Function to assign PAKAL to a soldier
function assignPAKAL(personal_number, pakal) {
  var soldier = db.soldiers.findOne({ personal_number: personal_number });
  var validPAKAL = db.pakals.findOne({ pakal: pakal });
  if (soldier && validPAKAL) {
      db.soldiers.updateOne({ personal_number: personal_number }, { $set: { PAKAL: pakal } });
      print("PAKAL assigned successfully.");
  } else {
      print("Invalid soldier or PAKAL.");
  }
}

// Function to assign class to a soldier
function assignClass(personal_number, className) {
  var soldier = db.soldiers.findOne({ personal_number: personal_number });
  var validClass = db.classes.findOne({ className: className });
  if (soldier && validClass) {
      db.soldiers.updateOne({ personal_number: personal_number }, { $set: { class: className } });
      print("Class assigned successfully.");
  } else {
      print("Invalid soldier or class.");
  }
}

// Usage examples:
// addSoldier(2, 'Jane Smith');
// assignPAKAL(2, 'Driver');
// assignClass(2, 'ClassA');