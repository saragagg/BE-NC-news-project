const app = require('../nc-news')
const request = require('supertest')
const db = require('../db/connection')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    db.end();
})

describe("app", () => {
    describe("GET /api/topics", () => {
        it("200: GET - should respond with an array of 3 topic objects", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.topics)).toBe(true);
                expect(body.topics).toHaveLength(3)
            })
        })
        it("200: GET - should respond with an array of topic objects. Each object should have a slug and description property", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                const topics = body.topics; 
                topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
        })
        it("404 - GET - should respond with a 404 status code if passed an invalid route as path", () => {
            return request(app)
            .get('/not-a-route')
            .expect(404)
            .then((result) => {
                expect(result.res.statusMessage).toBe('Not Found')
                expect(result.body.msg).toBe("Path not found")
            })
        })
        
    })
    describe("GET - /api/articles/:article_id", () => {
        it("200: GET - should respond with the article object of the article with the given article_id", () => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({body}) => {
                expect(typeof body.article).toBe("object");
                expect(Array.isArray(body.article)).toBe(false)
            })
        })
        it("200: GET - should respond with the requested article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
            return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({body}) => {
                const {article} = body;

                expect(article).toHaveProperty("author", expect.any(String));
                expect(article).toHaveProperty("title", expect.any(String));
                expect(article).toHaveProperty("article_id", expect.any(Number));
                expect(article).toHaveProperty("body", expect.any(String));
                expect(article).toHaveProperty("topic", expect.any(String));
                expect(article).toHaveProperty("created_at", expect.any(String));
                expect(article).toHaveProperty("votes", expect.any(Number));
                expect(article).toHaveProperty("article_img_url", expect.any(String));
            })
        })
    })
})





// handle 404 error 
// handle 400 band request error 

