const db = require("../db/connection");

function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `
      SELECT * FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
      `,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function insertComment(article_id, username, body) {
  return db
    .query(
      `
      INSERT INTO comments
      (body, article_id, author)
      VALUES 
      ($1, $2, $3)
      RETURNING *`,
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function removeCommentById(comment_id) {
  return db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1`,
    [comment_id]
  ).then(() => {
    return;
  })
}

function fetchCommentById(comment_id) {
  return db.query(`
  SELECT * FROM comments
  WHERE comment_id = $1
  `, [comment_id]).then(({rows, rowCount}) => {
    if (rowCount === 0) {
      return Promise.reject("comment_id not found")
    }

    return rows[0];
  })
}

module.exports = {
  fetchCommentsByArticleId,
  insertComment,
  removeCommentById,
  fetchCommentById
};
