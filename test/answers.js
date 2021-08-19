const expect = require("chai").expect;
const request = require("supertest");

const server = require('../index');
let app = request.agent(server);

describe("GET /api/v1/answers", function () {
    describe("get all answers", function () {
        it("Success should return {success : false} since get all answers is a protected route", function () {
            app.get('/api/v1/answers').end((err, res) => {
                expect(res.body.success).to.equal(false);
            });
        })
    })
});