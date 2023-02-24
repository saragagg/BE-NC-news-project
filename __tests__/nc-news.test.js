const app = require("../nc-news");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

const endpoints = require("../endpoints.json")

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
  describe("GET - /api/articles/:article_id/comments", () => {
    it("200: GET - should respond with an array of comments for the given article id. The array's length should reflect how many comments we have for the requested article", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("comments");
          const { comments } = body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments).toHaveLength(2);
        });
    });
    it("200: GET - should respond with an array of comments for the requested article. Each comment should have the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", expect.any(Number));
          });
        });
    });
    it("200: GET - should respond with an array of comments for the requested article. The comments should be ordered by date with the most recent comment first", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
    it("400: GET should respond with a Bad request error message if an invalid article_id is passed in the request path", () => {
      return request(app)
        .get("/api/articles/IAmAnInvalidId/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("404: GET should respond with a Not found error message if a valid but non existing article_id is passed in the request path", () => {
      return request(app)
        .get("/api/articles/125/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "article_id not found");
        });
    });
    it("200: GET should respond with a successful error code and an empty array of the comments in the response object if a valid and existing article_id is passed in the request path, but there is no comment for that article", () => {
      return request(app)
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("comments", []);
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
        body: "This article is fantastic",
      };

      return request(app)
        .post("/api/articles/65/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ msg: "article_id not found" });
        });
    });
  });
  describe("PATCH - /api/articles/:article_id", () => {
    it("201: PATCH - should take an object with an inc_votes property and increment/decrement the article's votes by the given value. The server should respond with the updated article.", () => {
      const expectedUpdatedArticle = {
        article_id: 4,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "2020-05-06T01:14:00.000Z",
        votes: 2,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };

      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: 2 })
        .expect(201)
        .then(({ body }) => {
          expect(body).toHaveProperty("updatedArticle", expectedUpdatedArticle);
        });
    });
    it("400: PATCH - should respond with a 400 bad request error if the object passed in the request body doesn't contain an inc_votes property", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ anotherProperty: 3 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("400: PATCH - should respond with a 400 bad request error if the object passed in the request body contains an inc_votes property which is not a number", () => {
      return request(app)
        .patch("/api/articles/4")
        .send({ inc_votes: "i am not a number" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("400: PATCH - should respond with a 400 bad request error if the article_id passed in the path is invalid", () => {
      return request(app)
        .patch("/api/articles/iAmAnInvalidId")
        .send({ inc_votes: 2 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("404: PATCH - should respond with a 404 not found error if the article_id passed in the path is valid but non existent", () => {
      return request(app)
        .patch("/api/articles/98")
        .send({ inc_votes: 2 })
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "article_id not found");
        });
    });
  });
  describe("GET - /api/users", () => {
    it("200: GET - should respond with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;

          expect(body).toHaveProperty("users");
          expect(users).toBeInstanceOf(Array);
        });
    });
    it("200: GET - should respond with an array of user objects. Each object should have the following properties: username, name, avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
    it("404: GET - should respond with a 404 error message if there's any typo in the path (non existent path", () => {
      return request(app)
        .get("/api/usfers")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Path not found");
        });
    });
  });
  describe("GET - /api/articles(queries)", () => {
    it("200: GET - should accept a topic query and respond with an array of articles filtered by the topic value specified. if the topic is missing, it should respond with all articles", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;

          expect(body).toHaveProperty("articles");
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toHaveLength(11);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic", "mitch");
          });
        });
    });
    it("200: GET - should accept a topic query and a sort_by query respond with an array of articles(filtered by the topic value if present) sorted by any valid column (defaults to date)", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length > 0).toBe(true);
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });
    it("200: GET - should accept a sort_by query respond with an array of articles(filtered by the topic value if present) sorted by any valid column (defaults to date) and ordered by the order query given (asc or desc)", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", { ascending: true });
        });
    });
    it("200: GET - should respond with an array of articles(filtered by the topic value if present) sorted by created_at if no sort_by query is present and ordered by the passed query (defauld to desc)", () => {
      return request(app)
        .get("/api/articles?topic=mitch&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    it("200: GET - should respond with an array of articles(filtered by the topic value if present and sorted by created_at or the sort_by query given. If no order by query is present, it should default to Desc.", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });
    it("404: GET - should respond with a 404 not found error if the topic passed is valid but doesn't exist in the databse", () => {
      return request(app)
        .get("/api/articles?topic=sara&sort_by=author")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Topic not found");
        });
    });
    it("200: GET - should respond with an empty array of articles if the topic passed is valid and exists in the databse, but there are no articles associated to it", () => {
      return request(app)
        .get("/api/articles?topic=paper&sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("articles", []);
        });
    });
    it("400: GET - should respond with a 400 error if the sort_by query passed is invalid", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=whatever")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("400: GET - should respond with a 400 error if the order query passed is invalid", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=whatever")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Invalid order query");
        });
    });
  });
  describe("GET - /api/articles/:article_id (comment count)", () => {
    it("200: GET - should respond with the article object requested based on the article_id. The article object should now include a comment_count property", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toHaveProperty("comment_count", "2");
        });
    });
    it("200: GET - should respond with the article object requested based on the article_id. The article object should now include a comment_count property, which will be 0 if that article has no comment", () => {
      return request(app)
        .get("/api/articles/4")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toHaveProperty("comment_count", "0");
        });
    });
    it("404: GET - should respond with a 404 not found error if passed a valid but non existent article_id", () => {
      return request(app)
        .get("/api/articles/78")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "article_id not found");
        });
    });
    it("400: GET - should respond with a 400 bad request error if passed a valid but non existent article_id", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
  });
  describe("DELETE - /api/comments/:comment_id", () => {
    it("should delete the given comment by comment_id and respond with a 204 status and no content", () => {
      return request(app).delete("/api/comments/18").expect(204);
    });
    it("should respond with a 400 bad request message if given an invalid comment_id", () => {
      return request(app)
        .delete("/api/comments/invalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "Bad request");
        });
    });
    it("should respond with a 404 not found message if given an valid but non existent comment_id", () => {
      return request(app)
        .delete("/api/comments/92")
        .expect(404)
        .then(({ body }) => {
          expect(body).toHaveProperty("msg", "comment_id not found");
        });
    });
  });
  describe("GET - /api", () => {
    it("should respond with a JSON object describing all the available endpoints on your API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("GET /api");
          expect(body).toHaveProperty("GET /api/topics");
          expect(body).toHaveProperty("GET /api/articles");
          expect(body).toHaveProperty("GET /api/articles/:article_id");
          expect(body).toHaveProperty("GET /api/articles/:article_id/comments");
          expect(body).toHaveProperty(
            "POST /api/articles/:article_id/comments"
          );
          expect(body).toHaveProperty("PATCH /api/articles/:article_id");
          expect(body).toHaveProperty("GET /api/users");
          expect(body).toHaveProperty("DELETE /api/comments/:comment_id");
        });
    });
    it("should respond with a JSON object describing all the available endpoints. Each endpoint property's value will be an object with the following properties: description, queries and exampleResponse.", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints)
        });
    });
  })
})
