const { fetchTopics, fetchArticles, fetchArticleById } = require('../models/models')

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

function getArticleById(req, res, next) {
    const {article_id} = req.params; 

    fetchArticleById(article_id).then(article => {
        res.status(200).send({ article }); 
    }).catch(err => {
        next(err);
    })
}





module.exports = {getTopics, getArticles, getArticleById}
