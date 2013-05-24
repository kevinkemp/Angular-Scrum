basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'lib/angularjs.js',
  'lib/angular-*.js',
  'lib/underscore.min.js',
  'tests/unit/**/*.js',
  'tests/specs/*.js',
  '*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};