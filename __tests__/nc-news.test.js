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
            })
        })
        
    })
    describe("GET /api/articles", () => {
        it("200: GET - should respond with an array of article objects. The array should have a length of 12", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                const {articles} = body; 
                expect(Array.isArray(articles)).toBe(true);
                expect(articles).toHaveLength(12);
            })
        })
        it("200: GET - each object of the articles array should have the following properties(author, title, article_id, topic, created_at, votes, article_img_url, comment_count)", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                const {articles} = body; 
                articles.forEach((article) => {
                    expect(article).toHaveProperty("author", expect.any(String));
                    expect(article).toHaveProperty("title", expect.any(String));
                    expect(article).toHaveProperty("article_id", expect.any(Number));
                    expect(article).toHaveProperty("topic", expect.any(String));
                    expect(article).toHaveProperty("created_at", expect.any(String));
                    expect(article).toHaveProperty("votes", expect.any(Number));
                    expect(article).toHaveProperty("article_img_url", expect.any(String));
                    expect(article).toHaveProperty("comment_count");
                })
            })
        })
        it("200: GET - should return an array of articles object sorted by date in descending order", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body}) => {
                const {articles} = body; 
                console.log(articles)
                const sortedArr = [...articles].sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at)});
                
                expect(articles).toEqual(sortedArr)
            })
        })
        it("404 - GET - should respond with a 404 status code if passed an invalid route as path", () => {
            return request(app)
            .get('/not-a-route')
            .expect(404)
            .then((result) => {
                console.log(result.body)
                expect(result.res.statusMessage).toBe('Not Found')
            })
        })
    })
})


// articles should be sorted by date in descending order 