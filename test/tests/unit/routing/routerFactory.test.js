const express = require('express');
const bodyParser = require('body-parser');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const routerFactory = require('../../../../routing/routerFactory');
const genCrud = routerFactory.genCrud;
const config = require('../../../../config/config').test;

const Sequelize = require('sequelize');
const MochaSuit = require("mocha-suit");
const TopSuit = MochaSuit("");
const Suit = TopSuit.extend('routerFactory');


const expect = chai.expect;
chai.use(chaiHttp);

const app = express();

let server;
let model;
let sequelize;


TopSuit.before(function () {
    app.use(bodyParser.json());
    server = app.listen(5000);

    sequelize = new Sequelize(config.database, config.username, config.password, config, {
        'define': {
            'charset': 'utf8',
            'collate': 'utf8_general_ci',
            'timestamps': true,
        },
    });
    model = sequelize.import('../../../resource/models/testModel');
    return sequelize.sync();
});

Suit.before(function () {
    const testRouter = genCrud(model);
    app.use('/api', testRouter);
    return sequelize.models.Test.bulkCreate([{ testString: 'test', testInteger: 12345 },{ testString: 'test2', testInteger: 54321 }, { testString: 'PUTtest', testInteger: 12345 }]);
});

Suit.it('/ GET api/model', function (done) {
    chai.request(app)
        .get(`/api/${model.name}`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.count).equal(3);
            expect(res.body.rows[0].testString).equal('test');
            expect(res.body.rows[1].testString).equal('test2');
            expect(res.body.rows[0].testInteger).equal(12345);
            expect(res.body.rows[1].testInteger).equal(54321);
        });
    chai.request(app)
        .get(`/api/noModelWithThisName`)
        .end((err, res) => {
            expect(res).to.have.status(404);
            done();
        });
});

Suit.it('/ GET api/model/id', function (done) {
    chai.request(app)
        .get(`/api/${model.name}/1`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res.body.id).equal(1);
            expect(res.body.testString).equal('test');
            expect(res.body.testInteger).equal(12345);
        });
    chai.request(app)
        .get(`/api/${model.name}/5`)
        .end((err, res) => {
            expect(res.req.res.req.res.text).equal('No data with this ID!');
            done();
        });
});

Suit.it('/ POST /api/testModel', function (done) {
    chai.request(app)
        .post(`/api/${model.name}`)
        .send({
            "testString":"qwe",
            "testInteger":123
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.testString).equal('qwe');
            expect(res.body.testInteger).equal(123);
        });
    chai.request(app)
        .post(`/api/${model.name}`)
        .send({
            "testString":"qwe",
            "testWrongField":123
        })
        .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.req.res.req.res.text).equal('Invalid data!');
            done();
        });
});

Suit.it('/ PUT /api/testModel/id', function (done) {
    chai.request(app)
        .put(`/api/${model.name}/3`)
        .send({
            "testString":"changedvalue",
            "testInteger": 100500
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.testString).equal('changedvalue');
            expect(res.body.testInteger).equal(100500);
        });
    chai.request(app)
        .put(`/api/${model.name}/5`)
        .send({
            "testString":"changedvalue",
            "testInteger": 100500
        })
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.req.res.req.res.text).equal('Not Found');
            done();
        });
});

Suit.it('/ DELETE /api/testModel/id', function (done) {
    chai.request(app)
        .delete(`/api/${model.name}/2`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(204);
        });
    chai.request(app)
        .delete(`/api/${model.name}/5`)
        .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.req.res.req.res.text).equal('Not Found');
            done();
        });
});

TopSuit.after(function () {
    server.close();
    fs.unlinkSync("test.db");
});

new Suit();
