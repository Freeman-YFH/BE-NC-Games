const db = require("../db/connection");
const { selectCategories, selectReviewById, selectReviews, selectCommentsByReviewId } = require("../models/games.model");

exports.getCategories = (req, res, next) => {
    selectCategories()
        .then((result) => {
            res.status(200).send({ result })
        })
        .catch(next);
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getReviews = (req, res, next) => {
    selectReviews()
        .then((result) => {
            res.status(200).send({ result });
        });
};

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params
    selectCommentsByReviewId(review_id)
        .then((comments) => {
            res.status(200).send({ comments });
        })
};