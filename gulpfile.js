var gulp = require('gulp');
 
// 获取 uglify 模块（用于压缩 JS）
var imageMin = require('gulp-imagemin');
gulp.task('image',function(){
    gulp.src('image/*.*')
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest('./images'))
})
 
gulp.task('default',['image'] )