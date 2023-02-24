function handle404NonExistentPaths(req, res, next) {
  res.status(404).send({ msg: "Path not found" });
}

function handlePSQL400err(err, req, res, next) {
  const psql400errors = ["22P02", "23502", "42703"];

  if (psql400errors.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
}

function handleCustomError(err, req, res, next) {
  const custom404Errors= ["article_id not found", "Topic not found", "comment_id not found"];
  const custom400Errors= ["Invalid sort query", "Invalid order query"];
  
  if (err.statusMessage === "Not Found" && err.statusCode === 404) {
    res.status(404).send({ msg: err.body });
  } else if (custom404Errors.includes(err)) {
    res.status(404).send({ msg: err });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "article_id not found" });
  } else if (custom400Errors.includes(err)) {
    res.status(400).send({ msg: err });
  } else {
    next(err);
  }
}

function handleError500(err, req, res, next) {
  res
    .status(500)
    .send({ msg: "Sorry, there has been an internal server error!" });
}

module.exports = {
  handleError500,
  handleCustomError,
  handlePSQL400err,
  handle404NonExistentPaths,
};
