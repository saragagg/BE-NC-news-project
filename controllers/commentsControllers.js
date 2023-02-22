const { insertComment, fetchCommentsByArticleId } = require("../models/commentModels");

const { fetchArticleById } = require("../models/articleModels");

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

module.exports = { postComment, getArticleComments };
