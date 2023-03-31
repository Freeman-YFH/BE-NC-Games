const db = require("../db/connection");
const format = require("pg-format");

exports.selectCategories = () => {
    return db
        .query(`SELECT * FROM categories`)
        .then((data) => {
            return data.rows;
        });
};

exports.selectReviewById = (review_id) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ msg: "Invalid input", status: 400 })
            }
            return data.rows[0]
        });
};

exports.selectReviews = (category, sort_by, order) => {

    if (sort_by && !['review_id', 'title', 'designer', 'owner', 'review_img_url', 'category', 'created_at', 'votes', 'comment_count'].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    };

    if (order && !['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    };

    let selectReviewsStr = `SELECT reviews.review_id, reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments on comments.review_id = reviews.review_id`;
    const queryValues = [];

    if (category) {
        selectReviewsStr += ` WHERE category = $1
        GROUP BY reviews.review_id ORDER BY created_at DESC;`;
        queryValues.push(category);
    } else if (sort_by) {
        selectReviewsStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} DESC;`
    } else if (order) {
        selectReviewsStr += ` GROUP BY reviews.review_id ORDER BY created_at ${order};`;
    } else {
        selectReviewsStr += ` GROUP BY reviews.review_id ORDER BY created_at DESC;`;
    }

    return db.query(selectReviewsStr, queryValues)
        .then((data) => {
            if (data.rows.length === 1) {
                return data.rows[0];
            }
            return data.rows;
        });
};

exports.checkCategoryExist = (category) => {
    return db
        .query(`SELECT * FROM categories WHERE slug = $1;`, [category])
        .then((data) => {
            if (data.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "category not exist" });
            }
            return [];
        })
};

exports.selectCommentsByReviewId = (review_id) => {
    return db
        .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`, [review_id])
        .then((data) => {
            return data.rows;
        });
};

exports.checkReviewIdExist = (review_id) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
        .then((data) => {

            if (data.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "review not found" });
            }
            return [];
        })
};

exports.insertCommentsByReviewId = (comment, id) => {
    const { username, body } = comment;
    const { review_id } = id
    return db
        .query(`INSERT INTO comments 
        (author, body, review_id) 
        VALUES 
        ($1, $2, $3) 
        RETURNING *;`,
            [username, body, review_id]
        )
        .then(({ rows }) => {
            return (rows[0])
        })
}

exports.updateReviewsByReview_id = (review_id, inc_votes) => {
    return db
        .query(`
        UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1 RETURNING *;`,
            [review_id, inc_votes])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ msg: "resource not exist", status: 400 })
            }
            return (rows[0]);
        })
};

exports.deleteComments = (comment_id) => {
    return db
        .query(`DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
            [comment_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "comment_id not found" });
            }
            return (rows[0]);
        });
};

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        });
};