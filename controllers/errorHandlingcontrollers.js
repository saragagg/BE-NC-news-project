function handlePSQL400err (err, req, res, next) {
    const psql400errors = ["22P02"];

    if(psql400errors.includes(err.code)) {
        res.status(400).send({msg: "Bad request"})
    } else {
        next(err)
    }
}


function handleCustomError (err, req, res, next) {
    if(err.statusMessage === "Not Found" && err.statusCode === 404) {
        res.status(404).send({msg: err.body})
    } else if (err === "article_id not found") {
        res.status(404).send({msg: err})
    } else {
        next(err);
    }
}


function handleError500 (err, req, res, next) {
    res.status(500).send({msg: "Sorry, there has been an internal server error!"})
}

module.exports = {handleError500, handleCustomError, handlePSQL400err}