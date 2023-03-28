const db = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app")
const seed = require("../db/seeds/seed")

beforeEach(() => { return seed(db) });

afterAll(() => { db.end });

describe('GET - /api/categories', () => {
    it('200: response with array of category objects', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                expect(body).toHaveLength(4);
                body.forEach((item) => {
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
                expect(body.msg).toBe("invalid path");
            })
    });
});