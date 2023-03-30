const db = require("../db/connection");

const { selectCategories, selectReviewById, selectReviews, selectCommentsByReviewId, checkReviewIdExist, insertCommentsByReviewId } = require("../models/games.model");


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
        .then((review) => {
            res.status(200).send({ review });

        });
};

exports.getCommentsByReviewId = (req, res, next) => {
    const { review_id } = req.params
    return selectCommentsByReviewId(review_id)
        .then((comments) => {
            if (comments.length === 0) {
                return checkReviewIdExist(review_id)
            }
            res.status(200).send({ comments });
        }).then((comments) => {
            res.status(200).send({ comments })
        })
        .catch((err) => {
            next(err)
        });
};

exports.postCommentsByReviewId = (req, res, next) => {
    insertCommentsByReviewId(req.body, req.params)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch((err) => {
            next(err);
        })
};
