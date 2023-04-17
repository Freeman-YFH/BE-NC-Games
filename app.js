const db = require("./db/connection");
const express = require("express");
const { getCategories, getReviewById, getReviews, getCommentsByReviewId, postCommentsByReviewId, patchReviewsByReview_id, deleteCommentsByCommentId, getUsers } = require("./controllers/games.controller");
const { handleCustomError, handlePsqlError, handleServerError } = require("./error-handle-controllers/errorHandle");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentsByReviewId);

app.patch("/api/reviews/:review_id", patchReviewsByReview_id);

app.delete("/api/comments/:comment_id", deleteCommentsByCommentId);

app.get("/api/users", getUsers);

app.use('*', (req, res, next) => {
    res.status(404).send({ msg: "Invalid path" })
});

app.use(handleCustomError);
app.use(handlePsqlError);
app.use(handleServerError);

module.exports = app;
