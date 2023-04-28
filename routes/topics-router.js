const { getTopics } = require("../controllers/topicsControllers");

const topicRouter = require('express').Router();

topicRouter.get("/", getTopics);

module.exports = topicRouter; 