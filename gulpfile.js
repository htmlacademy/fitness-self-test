const gulp = require("gulp");
const browserSync = require("browser-sync");
const backstop = require("backstopjs");
const bemlinter = require("gulp-html-bemlinter");
const { htmlValidator } = require("gulp-w3c-html-validator");

const server = browserSync.create();

const refresh = (done) => {
  server.reload();
  done();
};

const syncServer = (done) => {
  server.init({
    server: "build/",
    index: "index.html",
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("build/**/*", gulp.series(refresh, backstopTest));
  done();
};

const backstopTest = (done) =>
  backstop("test", { config: "pp.config.js" })
    .then(() => {
      // test successful
    })
    .catch(() => {
      // test failed
    })
    .finally(done);

const test = gulp.series(syncServer, backstopTest);

function lintBem() {
  return gulp.src("source/*.html").pipe(bemlinter());
}

function validateMarkup() {
  return gulp
    .src("source/*.html")
    .pipe(htmlValidator.analyzer())
    .pipe(htmlValidator.reporter({ throwErrors: true }));
}

module.exports = {
  test,
  lintBem,
  validateMarkup,
};
