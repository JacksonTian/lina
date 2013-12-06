var should = require('should');
var lexer = require('../lib/lexer');

describe('lexer/scan', function () {
  it('1', function () {
    lexer.scan('1').should.be.eql(['1']);
  });

  it('11', function () {
    lexer.scan('11').should.be.eql(['11']);
  });

  it('0.1', function () {
    lexer.scan('0.1').should.be.eql(['0.1']);
  });

  it('.1', function () {
    lexer.scan('.1').should.be.eql(['.1']);
  });

  it('-1', function () {
    lexer.scan('-1').should.be.eql(['-1']);
  });

  it('(+ 1 1)', function () {
    lexer.scan('(+ 1 1)').should.be.eql(['(', '+', '1', '1', ')']);
  });

  it('(+ 1 1) and line break', function () {
    lexer.scan('(+ 1 1)\n').should.be.eql(['(', '+', '1', '1', ')']);
  });

  it('(+\n 1 1)', function () {
    lexer.scan('(+\n 1 1)').should.be.eql(['(', '+', '1', '1', ')']);
  });

  it('(+\n1 1)', function () {
    lexer.scan('(+\n1 1)').should.be.eql(['(', '+', '1', '1', ')']);
  });

  it('(+ 1 (+ 2 3))', function () {
    lexer.scan('(+ 1 (+ 2 3))').should.be.eql(['(', '+', '1', '(', '+', '2', '3', ')', ')']);
  });

  it('[1 1]', function () {
    lexer.scan('[1 1]').should.be.eql(['[', '1', '1', ']']);
  });

  it('["1" "2"]', function () {
    lexer.scan('["1" "2"]').should.be.eql(['[', '"1"', '"2"', ']']);
  });

  it('"1"', function () {
    lexer.scan('"1"').should.be.eql(['"1"']);
  });

  it('" "', function () {
    lexer.scan('" "').should.be.eql(['" "']);
  });

  it('\'\'', function () {
    lexer.scan('\'\'').should.be.eql(['\'\'']);
  });

  it('()', function () {
    lexer.scan('()').should.be.eql(['(', ')']);
  });

  it('empty string', function () {
    lexer.scan('').should.be.eql([]);
  });

  it('space string', function () {
    lexer.scan(' ').should.be.eql([]);
  });

  it('" ', function () {
    (function () {
      lexer.scan('" ');
    }).should.throw('Except ".\n" \n  ^');
  });

  it('\'', function () {
    (function () {
      lexer.scan('\'');
    }).should.throw('Except \'.\n\'\n ^');
  });

  it('(', function () {
    (function () {
      lexer.scan('(');
    }).should.throw('Except ).\n(\n ^');
  });

  it(')', function () {
    (function () {
      lexer.scan(')');
    }).should.throw('Unexcepted ).\n)\n^');
  });

  it('[', function () {
    (function () {
      lexer.scan('[');
    }).should.throw('Except ].\n[\n ^');
  });

  it(']', function () {
    (function () {
      lexer.scan(']');
    }).should.throw('Unexcepted ].\n]\n^');
  });
});
