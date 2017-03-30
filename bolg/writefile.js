const mkdirp = require('mkdirp');
const fs = require('fs');

function writefile(filePath, content) {
  return new Promise(function (resolve, reject) {
    mkdirp(dirname(filePath), function (err) {
      if (err) reject(err);

      fs.writeFile(filePath, content, {encoding: 'utf-8'}, resolve);
    });
  });
}