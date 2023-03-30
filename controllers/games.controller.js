const db = require("../db/connection");

const { selectCategories, selectReviewById, selectReviews, selectCommentsByReviewId, checkReviewIdExist, insertCommentsByReviewId, updateReviewsByReview_id, deleteComments } = require("../models/games.model");



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
        });
};

exports.patchReviewsByReview_id = (req, res, next) => {
    if ((Object.keys(req.body)).length != 1) {
        next(res.status(400).send({ msg: "Invalid input" }))
    }
    const { inc_votes } = req.body;
    const { review_id } = req.params;

    updateReviewsByReview_id(review_id, inc_votes).then((review) => {
        res.status(200).send({ review });
    })
        .catch((err) => {
            next(err);
        });
};

exports.deleteCommentsByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    deleteComments(comment_id).then((comment) => {
        res.status(204).send()
    })
        .catch((err) => {
            next(err);
        });
};

