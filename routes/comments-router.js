const commentsRouter = require('express').Router();
const { deleteComment} = require("../controllers/commentsControllers");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;