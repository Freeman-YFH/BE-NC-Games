const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const { string } = require("pg-format");

beforeEach(() => { return seed(testData) });

afterAll(() => { db.end() });

describe('GET - /api/categories', () => {
    it('200: response with array of category objects', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                const { result } = body
                expect(result).toHaveLength(4);
                result.forEach((item) => {
                    expect(item).toHaveProperty('slug', expect.any(String));
                    expect(item).toHaveProperty("description", expect.any(String));
                })
            })
    });
    it('404: GET response with error message when input invalid path', () => {
        return request(app)
            .get('/api/wrongpath')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid path");
            })
    });
});

describe('GET - /api/reviews/:review_id', () => {
    it('200: response with a review object', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                });
            })
    });
    it('400: GET response with error message when given the ID is not a number', () => {
        return request(app)
            .get("/api/reviews/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    });
    it('400: GET response with error message when pass number don`t exist', () => {
        return request(app)
            .get("/api/reviews/9999")
            .expect(400)
            .then(({ body }) => { expect(body.msg).toBe("Invalid input"); })
    });
});

describe('GET - /api/reviews', () => {
    it('200: GET response with a array of reviews objects', () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toHaveLength(13);
                review.forEach((item) => {
                    expect(item).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                })
            })
    });
    it('404: GET response with error message when input invalid path', () => {
        return request(app)
            .get('/api/wrongpath')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid path");
            })
    });
});

describe('GET - /api/reviews/:review_id/comments', () => {
    it('200: GET response with an array of comments for the given review_id', () => {
        return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(3);
                comments.forEach((item) => {
                    expect(item).toMatchObject({
                        comment_id: expect.any(Number),
                        body: expect.any(String), votes: expect.any(Number),
                        author: expect.any(String),
                        review_id: expect.any(Number),
                        created_at: expect.any(String)
                    })
                })
                expect(comments).toBeSortedBy("created_at", { descending: true });
            })
    });
    it('400: GET response with error message when ID input is not a number', () => {
        return request(app)
            .get("/api/reviews/not-a-number/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    });
    it('400: GET response with error message when passed number doesn`t exist', () => {
        return request(app)
            .get("/api/reviews/9999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("review not found");
            })
    });
});

describe('POST - /api/reviews/:review_id/comments', () => {
    it('201: POST response with adding new object into database and sending out message', () => {
        const newComment = { username: 'bainesface', body: "Gaming is GOOD" }
        return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body
                expect(comment.body).toBe("Gaming is GOOD");
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    review_id: expect.any(Number),
                    created_at: expect.any(String)
                });
            })
    });
    it('404: POST response with error message when input a invalid review_id', () => {
        const newComment = { username: 'bainesface', body: "Gaming is GOOD" };
        return request(app)
            .post("/api/reviews/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("review not found");
            })
    });
    it('404: POST response with error message when input a invalid username', () => {
        const newComment = { username: 'aaa', body: "Gaming is GOOD" };
        return request(app)
            .post("/api/reviews/2/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("review not found");
            })
    });
});

describe('PATCH - /api/reviews/:review_id', () => {
    it('200: PATCH response with updating the votes number equal to 1 for the input review_id', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch("/api/reviews/1")
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                expect(review).toMatchObject({
                    review_id: 1,
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: 2,
                });
            })
    });
    it('200: PATCH response with updating the votes number equal to -100 for the input review_id', () => {
        const newVote = { inc_votes: -100 };
        return request(app)
            .patch("/api/reviews/1")
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
                const { review } = body
                expect(review).toMatchObject({
                    review_id: 1,
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: -99,
                });
            })
    });
    it('400: PATCH response with error when input a ID doesn`t exist', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch("/api/reviews/999")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("resource not exist");
            })
    });
    it('400: PATCH response with error when No `inc_votes` on request body', () => {
        const newVote = {};
        return request(app)
            .patch("/api/reviews/1")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            })
    });
    it('400: PATCH response with error with Invalid `inc_votes`', () => {
        const newVote = { inc_votes: "cat" };
        return request(app)
            .patch("/api/reviews/1")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    });
    it('400: PATCH response with error with Some other property on request body', () => {
        const newVote = { inc_votes: 1, name: 'Mitch' };
        return request(app)
            .patch("/api/reviews/1")
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            })
    });
});

describe('DELETE - /api/comments/:comment_id', () => {
    it('204: DELETE response with 204 and no content', () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ status }) => {
                expect(status).toBe(204);
            })
    });
    it('404: DELETE response with error with invalid comment_id', () => {
        return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("comment_id not found");
            })
    });
    it('400: DELETE response with error with not-a-number', () => {
        return request(app)
            .delete("/api/comments/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
            })
    });
});