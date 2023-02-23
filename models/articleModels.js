const db = require("../db/connection");

function fetchArticles(topic, sort_by = "articles.created_at", order = "DESC") {
  let queryStr = `
  SELECT 
  articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments
  ON articles.article_id=comments.article_id`;
  const queryValues = [sort_by, order];

  if (topic) {
    queryValues.unshift(topic);
    queryStr += ` WHERE topic = $1
    GROUP BY articles.article_id
    ORDER BY $2, $3`;
  } else {
    queryStr += ` GROUP BY articles.article_id
    ORDER BY $1, $2`;
  }

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
}

function fetchArticleById(article_id) {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1`,
      [article_id]
    )
    .then((result) => {
      const { rowCount, rows } = result;

      if (rowCount === 0) {
        return Promise.reject("article_id not found");
      }
      return rows[0];
    });
}

function updateVote(article_id, inc_votes) {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  fetchArticles,
  fetchArticleById,
  updateVote,
};
