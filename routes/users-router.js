const { getUsers } = require('../controllers/userControllers');

const usersRouter = require('express').Router();

usersRouter.get("/", getUsers);


module.exports = usersRouter; 