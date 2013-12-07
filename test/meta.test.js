var should = require('should');
var meta = require('../lib/meta');

describe('meta', function () {
  it('if', function () {
    meta['if'](true, 'foo', 'bar').should.be.equal('foo');
    meta['if'](false, 'foo', 'bar').should.be.equal('bar');
  });

  it('echo', function () {
    should.not.exist(meta['echo']());
  });

  it('+', function () {
    meta['+'](1, 1).should.be.equal(2);
    meta['+']('foo', 'bar').should.be.equal('foobar');
  });

  it('-', function () {
    meta['-'](1, 1).should.be.equal(0);
  });

  it('*', function () {
    meta['*'](1, 1).should.be.equal(1);
    meta['*'](9, 9).should.be.equal(81);
  });

  it('/', function () {
    meta['/'](1, 1).should.be.equal(1);
    meta['/'](9, 9).should.be.equal(1);
  });

  it('>', function () {
    meta['>'](3, 2).should.be.equal(true);
    meta['>'](2, 3).should.be.equal(false);
  });

  it('==', function () {
    meta['=='](3, 2).should.be.equal(false);
    meta['=='](3, 3).should.be.equal(true);
  });

  it('quote', function () {
    meta['quote'](3).should.be.equal(3);
    meta['quote'](2).should.be.equal(2);
  });
});
