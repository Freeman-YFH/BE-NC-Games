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
                expect(review).toBeSortedBy("created_at", { descending: true })
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
    it('404: GET response with error message when passed number doesn`t exist', () => {
        return request(app)
            .get("/api/reviews/9999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("comment not found");
            })
    });
    it('200: GET response with error message when ID exist but without any comment', () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([])
            })
    });
});