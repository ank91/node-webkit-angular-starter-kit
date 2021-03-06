(function () {
    'use strict';

    //@link https://github.com/nwjs/nw-builder/

    //include required plugins
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        utils = require('./utility'),
        NwBuilder = require('nw-builder'),
        jetpack = require('fs-jetpack');


    var nwBuilderOptions = {
        platforms: ['win32', 'win64', 'osx64', 'linux32', 'linux64'],
        buildType: 'default', // versioned
        version: '0.14.6', // nw.js version number, using LTS
        files: ['./dist/**/*'],
        winIco: (utils.os() === 'windows') ? './resources/windows/app-icon.ico' : null,
        zip: true,
        buildDir: './build',
        cacheDir: './cache'
    };


    var supportedPlatforms = function () {
        var platforms = [];

        if (utils.os() === 'windows') {
            //build for 32 bit even if current os is win64
            platforms.push('win32');
        }
        else if (utils.platform() === 'osx64') {
            //only built for 64 bit if current os is osx64
            platforms.push('osx64');
        }
        else if (utils.platform() === 'linux64') {
            //only built for 64 bit if current os is osx64
            platforms.push('linux64');
        }

        return platforms;
    };

    gulp.task('build', function () {

        //read original package.json
        var manifest = jetpack.read('./package.json', 'json');
        var platforms = supportedPlatforms();

        gutil.log('Build :', gutil.colors.blue('Detected current platform as - ' + utils.platform()));

        //exit early if platform not supported
        if (platforms.length === 0) {
            gutil.log('Build Error :', gutil.colors.white.bgRed.bold('Unsupported platform. Will Exit now.'));
            process.exit(1);
        }

        gutil.log('Build Info:', gutil.colors.blue('Building for platform - ' + platforms[0]));

        var nw = new NwBuilder({
            appName: null,  //auto get from package.json
            appVersion: null, //auto get from package.json
            macCredits: './resources/osx/credits.html',
            macIcns: './resources/osx/app-icon.icns',
            macPlist: {
                CFBundleDisplayName: manifest.productName || manifest.name,
                CFBundleName: manifest.productName || manifest.name
            },
            winIco: nwBuilderOptions.winIco, //wine should be installed on linux/mac systems to use this option
            version: nwBuilderOptions.version,
            files: nwBuilderOptions.files,
            zip: nwBuilderOptions.zip,
            platforms: platforms
        });

        // logging all messages
        nw.on('log', function (msg) {
            gutil.log('nw-builder Log:', msg);
        });

        // log success and fail events
        nw.build().then(function () {
            gutil.log('nw-builder Success:', gutil.colors.white.bgGreen.bold('Build done!'));
        }).catch(function (error) {
            gutil.log('nw-builder Error:', gutil.colors.red(error));
            //should exit and make build fail
            process.exit(1);
        });

    });

})();
