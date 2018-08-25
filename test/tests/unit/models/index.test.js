const MochaSuit = require("mocha-suit");
const chai = require('chai');
const loadModel = require('../../../../models');

const Suit = MochaSuit('loadModel');

Suit.it('Loading models', function () {
    const db = loadModel('./app/test/resource/models');
    const modelsList = Object.keys(db.sequelize.models);
    chai.expect(modelsList[0]).equal('Test');
    chai.expect(modelsList[1]).equal('Test2');
});

new Suit();