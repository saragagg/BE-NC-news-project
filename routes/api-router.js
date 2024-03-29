const apiRouter = require('express').Router();
const { getEndpoints } = require("../controllers/apisControllers");


const topicRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require('./comments-router');

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;