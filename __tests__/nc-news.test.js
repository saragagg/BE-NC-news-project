const app = require("../nc-news");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("GET /api/topics", () => {
    it("200: GET - should respond with an array of 3 topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          expect(body.topics).toHaveLength(3);
        });
    });
    it("200: GET - should respond with an array of topic objects. Each object should have a slug and description property", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body.topics;
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    it("404 - GET - should respond with a 404 status code if passed an invalid route as path", () => {
      return request(app)
        .get("/not-a-route")
        .expect(404)
        .then((result) => {
          expect(result.res.statusMessage).toBe("Not Found");
          expect(result.body.msg).toBe("Path not found");
        });
    });
  });
  describe("GET /api/articles", () => {
    it("200: GET - should respond with an array of article objects. The array should have a length of 12", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(12);
        });
    });
    it("200: GET - each object of the articles array should have the following properties(author, title, article_id, topic, created_at, votes, article_img_url, comment_count)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    it("200: GET - should return an array of articles object sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          const sortedArr = [...articles].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });

          expect(articles).toEqual(sortedArr);
        });
    });
    it("404 - GET - should respond with a 404 status code if passed an invalid route as path", () => {
      return request(app)
        .get("/not-a-route")
        .expect(404)
        .then((result) => {
          expect(result.res.statusMessage).toBe("Not Found");
        });
    });
  });
  describe("GET - /api/articles/:article_id", () => {
    it("200: GET - should respond with the article object of the article with the given article_id", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.article).toBe("object");
          expect(Array.isArray(body.article)).toBe(false);
        });
    });
    it("200: GET - should respond with the requested article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    });
    it("400: GET - should respond with a bad request error message if passed an invalid article_id in the path", () => {
      return request(app)
        .get("/api/articles/anInvalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("404: GET - should respond with a 404 not found error message if passed a valid but inexistent article_id in the path", () => {
      return request(app)
        .get("/api/articles/55")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "article_id not found");
        });
    });
  });
  describe("POST - /api/articles/:article_id/comments", () => {
    it("201: POST - should post a new comment for the given article and respond with the posted comment", () => {
      const newComment = {
        username: "rogersop",
        body: "This article is fantastic",
      };

      const expectedResponse = {
        article_id: 2,
        author: "rogersop",
        body: "This article is fantastic",
        comment_id: 19,
        created_at: expect.any(String),
        votes: 0,
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).toHaveProperty("posted_comment", expectedResponse);
        });
    });
    it("400: POST - should respond with a 400 bad request error when an invalid article_id is passed in the path", () => {
      const newComment = {
        username: "rogersop",
        body: "This article is fantastic",
      };

      return request(app)
        .post("/api/articles/iAmAnInvalidId/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Bad request" });
        });
    });
    it("400: POST - should respond with a 400 bad request error when the comment object in the request body doesn't follow the required structure (object with username and body as properties", () => {
      const newComment = {
        anIncorrectProperty: "rogersop",
        anotherIncorrectProperty: "This article is fantastic",
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "Bad request" });
        });
    });
    it("404: POST - should respond with a 404 error when a valid but non existend article_id is passed in the path", () => {
        const newComment = {
            username: "rogersop",
            body: "This article is fantastic"
        };

        return request(app)
        .post("/api/articles/65/comments")
        .send(newComment)
        .expect(404)
        .then(({body}) => {
            expect(body).toEqual({msg: "article_id not found"})
        })
    })
  });
});
