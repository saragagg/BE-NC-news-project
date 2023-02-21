const express = require('express');
const app = express();
const { getTopics, getArticleById } = require('./controllers/controllers')
const { handleError500, handleCustomError } = require('./controllers/errorHandlingcontrollers')


app.get('/api/topics', getTopics);


app.get('/api/articles/:article_id', getArticleById);



app.use((req, res, next) => {
    res.status(404).send({ msg: "Path not found" })
})

app.use(handleCustomError)
app.use(handleError500);


module.exports = app; 