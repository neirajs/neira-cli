const ghdownload = require('github-download');

module.exports = async function(path) {
  return new Promise((resolve, reject) => {
    ghdownload({
        user: 'neirajs',
        repo: 'framework',
        ref: 'master'
      },
      path
    )
    .on('error', (err) => {
      reject(err);
    })
    .on('end', () => {
      resolve();
    });
  })
}