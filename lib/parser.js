var fs = require('fs');
var path = require('path');

var table = {};
table['if'] = function (yes, a, b) {
  return yes ? a : b;
};

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

var wrapValue = function (token) {
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
  } else if (['+', '-', '*', '/', '%', '<', '>'].indexOf(token) !== -1) {
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
};

var getType = function (tokens) {
  return tokens.map(wrapValue);
};

var getExpressionTree = function (tokens) {
  var root = [];
  var current;
  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    if (item.token === '(') {
      var parent = current || root;
      current = [];
      current.parent = parent;
    } else if (item.token === ')') {
      current.parent.push(current);
      var back = current.parent;
      delete current.parent;
      current = back;
    } else {
      current.push(item);
    }
  }
  return root;
};

var getValue = function (token) {
  switch (token.type) {
    case 'number':
      return parseFloat(token.token);
    case 'boolean':
      var map = {'true': true, 'false': false};
      return map[token.token];
  }
};

var runExpression = function (expression) {
  expression = expression.map(function (exp) {
    return Array.isArray(exp) ? wrapValue(String(runExpression(exp))) : exp;
  });
  var call = expression[0];
  if (call.type === 'operator') {
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
    case '>':
      result = left > right;
      break;
    case '<':
      result = left < right;
      break;
    }
    return result;
  } else if (call.type === 'var') {
    var method = table[call.token];
    if (!method) {
      console.log('%s is undefined.', call.token);
    } else {
      var args = expression.slice(1);
      return method.apply(null, args.map(getValue));
    }
  }
};

exports.run = function (content) {
  var expressions = getExpressionTree(getType(getTokens(content)));
  // console.log(expressions);
  expressions.forEach(function (expression) {
    console.log(runExpression(expression));
  });
};
