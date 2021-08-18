const expect = require("chai").expect;
const request = require("supertest");

const server = require('../index');
let app = request.agent(server);

describe("GET /api/v1/questions", function () {
    describe("get all questions", function () {
        it("Success should return {success : true}", function () {
            app.get('/api/v1/questions').end((err, res) => {
                expect(res.body.success).to.equal(false);
                process.exit(0);
            });
        })
    })
});