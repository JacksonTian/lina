var lexer = require('./lexer');
var parser = require('./parser');

exports.run = function (content) {
  var tokens = lexer.scan(content);
  // console.log(tokens);
  var fixedTokens = parser.getType(tokens);
  // console.log(fixedTokens);
  var expressions = parser.getExpressionTree(fixedTokens);
  // console.log(JSON.stringify(expressions, '', '  '));
  expressions.forEach(function (expression) {
    console.log(parser.runExpression(expression));
  });
};
