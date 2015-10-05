(function () {
    'use strict';


    //include required plugins
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        utils = require('./utility'),
        NwBuilder = require('nw-builder'), //@https://github.com/nwjs/nw-builder/
        jetpack = require('fs-jetpack');


    var nwBuilderOptions = {
        platforms: ['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'],
        buildType: 'default', // versioned
        version: '0.12.3', // nw.js version number, using stable
        files: ['./dist/**/*'],
        winIco: (utils.os() === 'windows') ? './resources/windows/app-icon.ico' : null,
        macZip: true,
        buildDir: './build',
        cacheDir: './cache'
    };


    gulp.task('build', function () {

        //read original package.json
        var manifest = jetpack.read('./package.json', 'json');

        var nw = new NwBuilder({
            appName: null,  //auto get from package.json
            appVersion: null, //auto get from package.json
            macCredits: './resources/osx/credits.html',
            macIcns: './resources/osx/app-icon.icns',
            macPlist: {
                CFBundleDisplayName: manifest.productName,
                CFBundleName: manifest.productName
            },
            winIco: nwBuilderOptions.winIco, //wine should be installed on linux/mac systems to use this option
            version: nwBuilderOptions.version,
            files: nwBuilderOptions.files,
            macZip: nwBuilderOptions.macZip,
            platforms: ['linux64']
        });

        // logging all messages
        nw.on('log', function (msg) {
            gutil.log('nw-builder :', msg);
        });

        // log success and fail events
        nw.build().then(function () {
            gutil.log('nw-builder :', gutil.colors.green('Build done !'));
        }).catch(function (error) {
            gutil.log('nw-builder :', gutil.colors.red(error));
        });

    });

})();
