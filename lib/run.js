var lexer = require('./lexer');
var parser = require('./parser');

exports.run = function (content) {
  var tokens = lexer.scan(content);
  console.log(tokens);
  var expressions = parser.getExpressionTree(parser.getType(tokens));
  // console.log(expressions);
  expressions.forEach(function (expression) {
    console.log(parser.runExpression(expression));
  });
};
