const query = '/testRouter';
const nestedQuery = '/testDir/nestedTestRouter';

const MochaSuit = require("mocha-suit");
const chai = require('chai');

const indexRouter = require('../../../../routes');

const Suit = MochaSuit("loadRouter");

Suit.it('Loading nested routers', function () {
    indexRouter.loadRouter(`${process.cwd()}/app/test/resource/routes`);
    let routed = false;
    indexRouter.stack.forEach(router => {
        if (router.regexp.test(nestedQuery)) {
            routed = router.regexp.test(nestedQuery);
        }
    });
    chai.expect(routed).to.be.true;
});

Suit.it('Loading routers', function () {
    indexRouter.loadRouter(`${process.cwd()}/app/test/resource/routes`);
    let routed = false;
    indexRouter.stack.forEach(router => {
        if (router.regexp.test(query)) {
            routed = router.regexp.test(query);
        }
    });
    chai.expect(routed).to.be.true;
});

new Suit();
