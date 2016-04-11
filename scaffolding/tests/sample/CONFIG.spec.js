'use strict';

describe('CONFIG Unit Tests', function() {

  var CONFIG;

  beforeEach(module('app.const'));

  beforeEach(inject(function(_CONFIG_) {
    CONFIG = _CONFIG_;
  }));

  it('can get an instance of my factory', function() {
    expect(CONFIG).toBeDefined();
  });

  it('has all expected members', function() {
    expect(CONFIG.appName).toBeDefined();
  });

});
