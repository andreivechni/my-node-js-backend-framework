const MochaSuit = require("mocha-suit");
const chai = require('chai');

const Suit = MochaSuit("schemaConstructor");
const config = require('../../../../config/config').test;
const Sequelize = require('sequelize');
const sc = require('../../../../validation/schemaConstuctor');

let model;

Suit.before(function () {
    const sequelize = new Sequelize(config.database, config.username, config.password, config, {
        'define': {
            'charset': 'utf8',
            'collate': 'utf8_general_ci',
            'timestamps': true,
        },
    });
    model = sequelize.import('../../../resource/models/testModel');
});

Suit.it('Constructing schema', function () {
    const schema = sc(model);
    chai.assert.deepPropertyVal(schema, 'properties', {
        testString: {type: 'string', required: true},
        testInteger: {type: 'integer', required: true},
    });
});
new Suit();