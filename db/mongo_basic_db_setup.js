// 1 - install mongo
// 2 - start mongo - mongod
// 3 - run js in mongo shell - mongo < setupDatabase.js

// Switch to the desired database
use tactease_test1;

//should we reset the DB?
const do_reset = 1;

// RESET DB - to rebuild from scratch
if(do_reset){
db.runCommand({ dropDatabase: 1 });
}

// // Insert users
// db.users.insertMany([
//   { personal_number: '1', fullname: 'user1', class: '' },
//   { personal_number: '2', fullname: 'user2', class: '' },
// ]);

// Insert classes
db.classes.insertMany([
  { id: '1', name: 'class1' },
  { id: '2', name: 'class2' },
]);

//add commanders
db.commanders.insertMany([
  { personal_number: '1', fullname: 'com1', class: ''},
  { personal_number: '2', fullname: 'com2', class: ''},
]);

//add soldiers
db.soldiers.insertMany([
  { personal_number: '3', fullname: 'sol1', class: '', pakal: '', constraints: '' },
  { personal_number: '4', fullname: 'sol2', class: '', pakal: '', constraints: '' },
  { personal_number: '5', fullname: 'sol3', class: '', pakal: '', constraints: '' },
  { personal_number: '6', fullname: 'sol4', class: '', pakal: '', constraints: '' },
]);

db.missions.insertMany([
  { mission_id: '1', name: 'miss1', start: '2024-03-01-13:00', end: '2024-03-01-15:00', soldiers: ''},
  { mission_id: '2', name: 'miss2', start: '2024-05-01-15:00', end: '2024-05-01-16:40', soldiers: ''},
]);

// Update users with references to classes - many to one
db.users.update(
  { personal_number: '3' },
  {
    $set: {
      class: db.classes.findOne({ name: 'class1' })._id,
    },
  }
);

db.users.update(
  { personal_number: '4' },
  {
    $set: {
      class: db.classes.findOne({ name: 'class2' })._id,
    },
  }
);

db.users.update(
  { personal_number: '5' },
  {
    $set: {
      class: db.classes.findOne({ name: 'class2' })._id,
    },
  }
);