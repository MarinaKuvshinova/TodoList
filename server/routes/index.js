const {Router} = require('express');
const router = Router();
const FBAuth = require('../fbAuth');

//const {admin, db} = require('../firebase');
const {signIn, signUp, uploadImage, userDetails, getUser} = require('./user');
const {tasks, taskAdd, taskDelete, taskCheck} = require('./tasks');
const {projects, projectAdd, projectDelete} = require('./projects');
const {users, usersAddProject, usersProject, usersDelete} = require('./users');


//user
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/user/image', FBAuth, uploadImage);
router.post('/user', FBAuth, userDetails);
router.get('/user', FBAuth, getUser);


//tasks
router.post('/tasks', FBAuth,  tasks);
router.put('/task/add', FBAuth, taskAdd);
router.delete('/task/:id', FBAuth, taskDelete);
router.put('/task/check/:id', taskCheck);

//projects
router.post('/projects', FBAuth, projects);
router.put('/project/add', FBAuth, projectAdd);
router.delete('/project/:id', FBAuth, projectDelete);

//users
router.post('/users', FBAuth, users);
router.put('/users/add/project', usersAddProject);
router.post('/users/project/:id', FBAuth, usersProject);
// router.put('/users/add/task', FBAuth, usersAddTask);




module.exports = router;