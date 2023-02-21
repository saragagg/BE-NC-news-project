const { fetchTopics, fetchArticles } = require('../models/models')

function getTopics(req, res, next) {

    fetchTopics().then(topics => { 
     res.status(200).send({topics});
    }).catch(err => {
        next(err);
    })
}


function getArticles(req, res, next) {

    fetchArticles().then(articles => {
        res.status(200).send({articles})
    }).catch(err => {
        next(err);
    })
}




module.exports = {getTopics, getArticles}