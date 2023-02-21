const { fetchTopics, fetchArticleById } = require('../models/models')

function getTopics(req, res, next) {

    fetchTopics().then(topics => { 
     res.status(200).send({topics});
    }).catch(err => {
        next(err);
    })
}


function getArticleById(req, res, next) {
    const {article_id} = req.params; 

    fetchArticleById(article_id).then(article => {
        res.status(200).send({ article }); 
    })
}

module.exports = {getTopics, getArticleById}