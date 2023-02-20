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
})







//handle 500 status code 

// Errors needs to be handled.

