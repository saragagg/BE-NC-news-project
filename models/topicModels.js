const db = require("../db/connection");

function fetchTopics() {
  return db
    .query(
      `
    SELECT * FROM topics
    `
    )
    .then(({ rows }) => {
      return rows;
    });
}

function checkTopicExists(topic) {
  return db.query(`
  SELECT * FROM topics
  WHERE slug = $1`, [topic]).then(({rows, rowCount}) => {
    if (rowCount === 0) {
      return Promise.reject("Topic not found");
    }
    return rows[0];
  })
}

module.exports = {fetchTopics, checkTopicExists};