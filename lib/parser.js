var meta = {};
meta['if'] = function (yes, a, b) {
  return yes ? a : b;
};
meta['echo'] = function (str) {
  console.log(str);
};
meta['+'] = function (left, right) {
  return left + right;
};
meta['-'] = function (left, right) {
  return left - right;
};
meta['*'] = function (left, right) {
  return left * right;
};
meta['/'] = function (left, right) {
  return left / right;
};
meta['>'] = function (left, right) {
  return left > right;
};
meta['=='] = function (left, right) {
  return left === right;
};
meta['quote'] = function (a) {
  return a;
};

var table = {};

var wrapValue = function (token) {
  if (token[0] === '\'' || token[0] === '\"') {
    return {
      token: token.substring(1, token.length - 1),
      type: 'string'
    };
  } else if (token === 'true' || token === 'false') {
    var map = {'true': true, 'false': false};
    return {
      token: map[token],
      type: 'boolean'
    };
  } else if (/\d+/.test(token)) {
    return {
      token: parseFloat(token),
      type: 'number'
    };
  } else if (token === '(' || token === ')') {
    return {
      token: token,
      type: 'symbol'
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
      if (current) {
        current.push(item);
      } else {
        root.push(item);
      }
    }
  }
  return root;
};

exports.call = function (fun, args) {
  exports.runExpression(fun.exp);
};

exports.runExpression = function (expression) {
  if (!Array.isArray(expression)) {
    return expression.token;
  }
  var call = expression[0];
  if (call.type === 'var') {
    var method = call.token;
    if (method === 'def') {
      var name = expression[1].token;
      // 定义函数
      table[name] = {
        args: expression[2],
        exp: expression[3]
      };
    } else {
      var fun = meta[method];
      if (fun) {
        var args = expression.slice(1);
        return fun.apply(null, args.map(function (item) {
          if (Array.isArray(item)) {
            return exports.runExpression(item);
          }
          return item.token;
        }));
      }
      fun = table[method];
      if (!fun) {
        console.log('%s is undefined.', call.token);
      } else {
        var actuals = expression.slice(1);
        return exports.call(fun, actuals.map(function (item) {
          return Array.isArray(item) ? wrapValue(String(exports.runExpression(item))) : item;
        }));
      }
    }
  }
};
