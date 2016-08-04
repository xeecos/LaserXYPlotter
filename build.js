var NwBuilder = require('nw-builder');

var nw = new NwBuilder({
  files: ['./package.json', './public/**','./Marlin/**',"./assets/**"],
  platforms: ['osx64'],
  macIcns: './assets/app.icns'
});

nw.build().then(function () {
  console.log('done');
}).catch(function (error) {
  console.error(error);
})