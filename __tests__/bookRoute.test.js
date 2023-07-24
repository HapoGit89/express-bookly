const request = require("supertest");


const app = require("../app");
const db = require("../db");
const Book = require("../models/book")

process.env.NODE_ENV = 'test'


describe("Book Routes Test", function () {

    beforeEach(async function () {
        await db.query("DELETE FROM books");


        let u1 = await Book.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
    });



    describe("GET /books/", function () {
        test("can get list of books", async function () {
            let response = await request(app)
                .get("/books/")

            expect(response.statusCode).toEqual(200);
            expect(response.body.books).toEqual([
                {
                    isbn: '0691161518',
                    amazon_url: 'http://a.co/eobPtX2',
                    author: 'Matthew Lane',
                    language: 'english',
                    pages: 264,
                    publisher: 'Princeton University Press',
                    title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
                    year: 2017
                }
            ])
        });
    });


    describe("GET /books/:id", function () {
        test("can get specific book by isbn?", async function () {
            let response = await request(app)
                .get("/books/0691161518")

            expect(response.statusCode).toEqual(200);
            expect(response.body.book).toEqual(
                {
                    isbn: '0691161518',
                    amazon_url: 'http://a.co/eobPtX2',
                    author: 'Matthew Lane',
                    language: 'english',
                    pages: 264,
                    publisher: 'Princeton University Press',
                    title: 'Power-Up: Unlocking the Hidden Mathematics in Video Games',
                    year: 2017
                }
            )
        });
        test("cant get book with wrong isbn??", async function () {
            let response = await request(app)
                .get("/books/0691161347438743874518")
            console.log(response)
            expect(response.statusCode).toEqual(404)
            expect(response.text).toEqual(`{"error":{"message":"There is no book with an isbn '0691161347438743874518","status":404},"message":"There is no book with an isbn '0691161347438743874518"}`)


        });


    });

    describe("POST /books/", function () {
        test("can post book?", async function () {
            let response = await request(app)
                .post("/books/").send({
                    "isbn": "0691261518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lanes",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                })

            expect(response.statusCode).toEqual(201);
            expect(response.body.book).toEqual(
                {
                    "isbn": "0691261518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lanes",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
            )
        });

        test("cant post book with wrong json??", async function () {
            let response = await request(app)
                .post("/books/").send({
                    "isbn": "0691261518",
                    "author": "Matthew Lanes",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                })

            expect(response.statusCode).toEqual(400);
            expect(response.text).toContain("amazon_url")
        });



    });

    describe("PUT /books/", function () {
        test("can update book?", async function () {
            let response = await request(app)
                .put("/books/0691161518").send({
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lanesing",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                })

            expect(response.statusCode).toEqual(200);
            expect(response.body.book).toEqual(
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Matthew Lanesing",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                }
            )
        });

        test("cant put book with wrong json??", async function () {
            let response = await request(app)
                .put("/books/0691161518").send({
                    "isbn": "0691261518",
                    "author": "Matthew Lanes",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Down: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                })

            expect(response.statusCode).toEqual(400);
            expect(response.text).toContain("amazon_url")
        });



    });

    describe("DELETE /books/", function () {
        test("can delete book?", async function () {
            let response = await request(app)
                .delete("/books/0691161518")

            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual(
                { message: "Book deleted" }
            )
        });

        test("can delete book with non existing isbn??", async function () {
            let response = await request(app)
                .delete("/books/0691161518298293")

            expect(response.statusCode).toEqual(404);
            expect(response.text).toContain(
                "There is no book with an isbn "
            )
        });





    });
});

afterAll(async function () {
    await db.end();
});