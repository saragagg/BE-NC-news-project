const express = require('express');
const app = express();
const { getTopics, getArticles } = require('./controllers/controllers')
const { handleError500, handleCustomError } = require('./controllers/errorHandlingcontrollers')



app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.use(handleCustomError)
app.use(handleError500);


module.exports = app; 