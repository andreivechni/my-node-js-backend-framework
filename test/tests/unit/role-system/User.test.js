const MochaSuit = require("mocha-suit");
const chai = require('chai');

console.log(process.cwd());

const User = require('../../../../role-system/User');
let testUser;

const Suit = MochaSuit('User');

Suit.before(function () {
    testUser = new User(1, 'testName', 'testToken', 'testRole2');
});

Suit.it('Checks priviliages', function (done) {
    chai.expect(testUser.hasPriv('testModel1', 'testMethod1')).to.be.true;
    chai.expect(testUser.hasPriv('testModel1', 'testMethod2')).to.be.true;
    done();
});

Suit.it('Checks priviliages', function (done) {
    chai.expect(testUser.getLims('testModel1', 'testMethod1')).to.be.null;
    chai.expect(testUser.getLims('testModel1', 'testMethod2')).to.deep.equal({ where: { lim1: 'limVal1', lim2: 'limVal2' } });
    done();
});

new Suit();