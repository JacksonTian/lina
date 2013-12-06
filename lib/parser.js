var table = {};
table['if'] = function (yes, a, b) {
  return yes ? a : b;
};

table['echo'] = function (str) {
  console.log(str);
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
  } else if (token === '(' || token === ')') {
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

exports.getType = function (tokens) {
  return tokens.map(wrapValue);
};

exports.getExpressionTree = function (tokens) {
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
  case 'string':
    return token.token.substring(1, token.token.length - 1);
  }
};


exports.runExpression = function (expression) {
  expression = expression.map(function (exp) {
    return Array.isArray(exp) ? wrapValue(String(exports.runExpression(exp))) : exp;
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
