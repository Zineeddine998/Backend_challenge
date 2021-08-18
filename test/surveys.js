const expect = require("chai").expect;
const request = require("supertest");

const server = require('../index');
let app = request.agent(server);

describe("POST /api/v1/surveys", function () {
    describe("adding new survey", function () {
        it("Success should return {success : true}", function () {
            app.post('/api/v1/surveys').send({
                name: 'test survey',
                description: 'description 12',
                questions: []
            }).end((err, res) => {
                expect(res.body.success).to.equal(false);
            });
        })
    })
});

describe("GET /api/v1/surveys", function () {
    describe("get all surveys", function () {
        it("Success should return a list of surveys", function () {
            app.get('/api/v1/surveys')
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                })
        })
    })
});


describe("GET /api/v1/surveys/:id", function () {
    describe("get a single survey by id", function () {
        it("Success should return a survey with the corresponding id", function () {
            app.get('/api/v1/surveys/611d605357d4a8122d86b272')
                .end((err, res) => {
                    expect(res.body.success).to.equal(true);
                })
        })
    })
});

describe("PUT /api/v1/surveys/:id", function () {
    describe("update a single survey by id", function () {
        it("Success should return {success : false} since update survey is a protected route", function () {
            app.put('/api/v1/surveys/611d605357d4a8122d86b272').send({
                name: "updated survey",
                "description": "updated description"
            })
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                })
        })
    })
});
describe("DELETE /api/v1/surveys/:id", function () {
    describe("delete a single survey by id", function () {
        it("Success should return", function () {
            app.delete('/api/v1/surveys/611d605357d4a8122d86b272')
                .end((err, res) => {
                    expect(res.body.success).to.equal(false);
                    process.exit(0);
                })
        })
    })
});


