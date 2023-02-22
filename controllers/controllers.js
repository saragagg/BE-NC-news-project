const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  insertComment,
  updateVote
} = require("../models/models");

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res, next) {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params;
  const articleCheck = fetchArticleById(article_id);
  const commentsByArticlePromise = fetchCommentsByArticleId(article_id);

  Promise.all([commentsByArticlePromise, articleCheck])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postComment(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then((posted_comment) => {
      res.status(201).send({ posted_comment });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleVote(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const articleCheck = fetchArticleById(article_id);
  const updateVotePromise = updateVote(article_id, inc_votes);

  Promise.all([updateVotePromise, articleCheck]).then(([updatedArticle]) => {
      res.status(201).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
}



module.exports = {
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
   postComment,
   patchArticleVote,
};
