// 1 - install mongo
// 2 - start mongo - mongod
// 3 - run js in mongo shell - mongo < setupDatabase.js

// Switch to the desired database
use mydatabase;

// RESET DB - to rebuild from scratch
db.runCommand({ dropDatabase: 1 });

// Insert users
db.users.insertMany([
  { personal_number: '1', fullname: 'user1', class: '' },
  { personal_number: '2', fullname: 'user2', class: '' },
]);

// Insert classes
db.classes.insertMany([
  { id: '1', name: 'object1' },
  { id: '2', name: 'object2' },
]);

//user type 1
db.users_s.insertMany([
  { personal_number: '3', fullname: 'user1', class: '', pakal: '' },
  { personal_number: '4', fullname: 'user2', class: '', pakal: '' },
]);

// //user type 2
// db.users_c.insertMany([
//   { personal_number: '3', fullname: 'user1', class: ''},
//   { personal_number: '4', fullname: 'user2', class: ''},
// ]);

// Update users with references to classes - many to one
db.users.update(
  { personal_number: '1' },
  {
    $set: {
      class: db.classes.findOne({ name: 'object1' })._id,
    },
  }
);

db.users.update(
  { personal_number: '2' },
  {
    $set: {
      class: db.classes.findOne({ name: 'object2' })._id,
    },
  }
);