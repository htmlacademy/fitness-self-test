const gulp = require('gulp');
const browserSync = require('browser-sync');
const backstop = require('backstopjs');

const server = browserSync.create();

const refresh = (done) => {
  server.reload();
  done();
};

const syncServer = (done) => {
  server.init({
    server: 'build/',
    index: 'index.html',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('build/**/*', gulp.series(refresh));
  done();
};

const test = gulp.series(syncServer, () => {
  backstop('test',  {config:'pp.config.js'})
      .then(() => {
        // test successful
      }).catch(() => {
    // test failed
  });
});

module.exports = {
  test,
};