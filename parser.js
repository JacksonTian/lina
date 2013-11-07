var fs = require('fs');
var path = require('path');

var argv = process.argv;

if (!argv[2]) {
  console.log('Please use:\n  %s %s filename.js', argv[0], argv[1]);
  process.exit(1);
}

var content = fs.readFileSync(path.join(__dirname, argv[2]), 'utf8');

console.log(content);

var getTokens = function (content) {
  var flags = {
    'single': false, // 单引号
    'double': false, // 双引号
    '()': false // 括号
  };
  var index = 0;
  var results = [];
  var current = '';
  while (index < content.length) {
    var value = content.charAt(index);
    if (value === '(') {
      if (!flags.single && !flags.double) {
        results.push(value);
        current = '';
        flags['()'] = true;
      }
    } else if (value === ')') {
      if (!flags.single && !flags.double) {
        results.push(current);
        results.push(value);
        current = '';
        flags['()'] = false;
      }
    } else if (value === '\'') {
      if (!flags.single && !flags.double) {
        current = '\'';
        flags.single = true;
      } else if (flags.single) {
        current += '\'';
        results.push(current);
        current = '';
        flags.single = false;
      }
    } else if (value === '\"') {
      if (!flags.single && !flags.double) {
        current = '\"';
        flags.double = true;
      } else if (flags.double) {
        current += '\"';
        results.push(current);
        current = '';
        flags.double = false;
      }
    } else if (value === ' ') {
      if (!flags.single && !flags.double) {
        if (current) {
          results.push(current);
          current = '';
        }
      } else {
        current += ' ';
      }
    } else {
      current += value;
    }
    index++;
  }
  return results;
};

var getType = function (tokens) {
  return tokens.map(function (token) {
    if (token[0] === '\'' || token[0] === '\"') {
      return {
        token: token,
        type: 'string'
      };
    } else if (token === 'true' || token === 'false') {
      return {
        token: token,
        type: 'boolean'
      };
    } else if (/\d+/.test(token)) {
      return {
        token: token,
        type: 'number'
      };
    } else if (token === '(' || token ===')') {
      return {
        token: token,
        type: 'symbol'
      };
    } else if (['+', '-', '*', '/', '%'].indexOf(token) !== -1) {
      return {
        token: token,
        type: 'operator'
      };
    } else {
      return {
        token: token,
        type: 'var'
      };
    }
  });
};

var getExpressionTree = function (tokens) {
  var expressions = [];
  var current = [];
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    if (item.token === '(') {
      current = [];
    } else if (item.token === ')') {
      expressions.push(current);
    } else {
      current.push(item);
    }
  }

  return expressions;
};

var getValue = function (token) {
  switch (token.type) {
    case 'number':
      return parseInt(token.token, 10);
  }
};

var runExpression = function (expression) {
  var call = expression[0];
  var left = getValue(expression[1]);
  var right = getValue(expression[2]);
  var result;
  switch (call.token) {
  case '+':
    result = left + right;
    break;
  case '-':
    result = left - right;
    break;
  case '*':
    result = left * right;
    break;
  case '/':
    result = left / right;
    break;
  case '%':
    result = left % right;
    break;
  }
  return result;
};

var expressions = getExpressionTree(getType(getTokens(content)));
// console.log(expressions);
expressions.forEach(function (expression) {
  console.log(runExpression(expression));
});
