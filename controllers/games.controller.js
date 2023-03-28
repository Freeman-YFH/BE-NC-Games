const db = require("../db/connection");
const { selectCategories, selectReviewById } = require("../models/games.model");

exports.getCategories = (req, res, next) => {
    selectCategories()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch(next);
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id)
        .then((review) => {
            res.status(200).send({ review })
        })
        .catch((err) => {
            next(err);
        });
};