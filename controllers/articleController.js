const {
  fetchArticles,
  fetchArticleById,
  updateVote
} = require("../models/articleModels");

function getArticles(req, res, next) {
  const {topic, sort_by, order} = req.query;

  fetchArticles(topic, sort_by, order)
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

function patchArticleVote(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const articleCheck = fetchArticleById(article_id);
  const updateVotePromise = updateVote(article_id, inc_votes);

  Promise.all([updateVotePromise, articleCheck])
    .then(([updatedArticle]) => {
      res.status(201).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
}



module.exports = {
  getArticles,
  getArticleById,
  patchArticleVote,
};
