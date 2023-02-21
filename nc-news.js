const express = require('express');
const app = express();
const { getTopics, getArticles, getArticleById } = require('./controllers/controllers')
const { handleError500, handleCustomError, handlePSQL400err } = require('./controllers/errorHandlingcontrollers')



app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);



app.use((req, res, next) => {
    res.status(404).send({ msg: "Path not found" })
})


app.use(handlePSQL400err);
app.use(handleCustomError);
app.use(handleError500);


module.exports = app; 