const articlesRouter = require('express').Router();
const {
    getArticles,
    getArticleById,
    patchArticleVote,
  } = require("../controllers/articleController");

  const {
    postComment,
    getArticleComments,
  } = require("../controllers/commentsControllers");
 
articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVote);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);

module.exports = articlesRouter; 