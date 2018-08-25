const fs = require('fs');
const path = require('path');

const router = require('express').Router();

const basename = path.basename(__filename);

function loadRouter(dir, content) {
  let files = content;
  if (!files) {
    files = {};
  }
  const contents = fs.readdirSync(dir);
  contents.filter(item => (item !== 'index.js')).forEach((curContent) => {
    const newPath = `${dir}/${curContent}`;
    if (fs.lstatSync(newPath).isDirectory()) {
      loadRouter(newPath, files);
    } else {
      const absPath = `${dir}/${curContent}`;
      const relPath = `.${absPath.slice(absPath.indexOf('routes') + 'routes'.length)}`;
      if (relPath !== `./${basename}`) {
        // eslint-disable-next-line
        const route = require(path.resolve(process.cwd(), absPath));
        router.use(relPath.slice(1, -3), route);
        files[relPath] = route;
      }
    }
  });
  return files;
}

module.exports = router;
module.exports.loadRouter = loadRouter;

