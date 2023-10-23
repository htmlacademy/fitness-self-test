import gulp from 'gulp';
import browserSync from 'browser-sync';

const server = browserSync.create();

const refresh = (done) => {
  server.reload();
  done();
};

const syncServer = () => {
  server.init({
    server: 'build/',
    index: 'index.html',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('build/**/*', gulp.series(refresh));
};
export const serve = gulp.series(syncServer);
