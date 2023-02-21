const db = require('../db/connection')

function fetchTopics() {
    return db.query(`
    SELECT * FROM topics
    `).then(({rows}) => {
        return rows;
    })
}

function fetchArticleById(id) {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1`, [id]).then(({rows}) => {
        return rows[0];
    })
}


module.exports = { fetchTopics, fetchArticleById }