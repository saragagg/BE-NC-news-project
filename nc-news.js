const express = require("express");
const app = express();
const {
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
  postComment,
  patchArticleVote
} = require("./controllers/controllers");

const {
  handleError500,
  handleCustomError,
  handlePSQL400err,
  handle404NonExistentPaths,
} = require("./controllers/errorHandlingcontrollers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVote);

app.use(handle404NonExistentPaths);

app.use(handlePSQL400err);
app.use(handleCustomError);
app.use(handleError500);

module.exports = app;
