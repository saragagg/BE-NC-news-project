const express = require('express');
const app = express();
const { getTopics } = require('./controllers/controllers')
const { handleError500, handleCustomError } = require('./controllers/errorHandlingcontrollers')


app.get('/api/topics', getTopics);

app.use(handleCustomError, handleError500);


module.exports = app; 