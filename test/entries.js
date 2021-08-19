const expect = require("chai").expect;
const request = require("supertest");

const server = require('../index');
let app = request.agent(server);

describe("GET /api/v1/entries", function () {
    describe("get all entries", function () {
        it("Success should return {success : false} since get all entries is a protected route", function () {
            app.get('/api/v1/entries').end((err, res) => {
                expect(res.body.success).to.equal(false);
            });
        })
    })
});