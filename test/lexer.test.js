var should = require('should');
var lexer = require('../lib/lexer');

describe('lexer/scan', function () {
  it('1', function () {
    lexer.scan('1').should.be.eql(['1']);
  });

  it('(+ 1 1)', function () {
    lexer.scan('(+ 1 1)').should.be.eql(['(', '+', '1', '1', ')']);
  });
});
