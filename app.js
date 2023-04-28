const express = require("express");
const app = express();

const cors = require('cors');
const apiRouter = require('./routes/api-router');


const {
  handleError500,
  handleCustomError,
  handlePSQL400err,
  handle404NonExistentPaths,
} = require("./controllers/errorHandlingcontrollers");


app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle404NonExistentPaths);

app.use(handlePSQL400err);
app.use(handleCustomError);
app.use(handleError500);

module.exports = app;
