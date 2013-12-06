// 词法分析器
// 从源代码中扫描出Tokens
exports.scan = function (content) {
  var flags = {
    'single': [], // 单引号
    'double': [], // 双引号
    '()': [], // 括号
    '[]': [] // 小括号
  };
  var index = 0;
  var prepareError = function (message) {
    var err = new Error();
    err.name = 'SyntaxError';
    message = message + content + '\n';
    for (var i = 0; i < index; i++) {
      message += ' ';
    }
    message += '^';
    err.message = message;
    return err;
  };

  var getLast = function (stack) {
    return stack[stack.length - 1];
  };

  var results = [];
  var current = '';
  while (index < content.length) {
    var value = content.charAt(index);
    if (value === '(') {
      if (!getLast(flags.single) && !getLast(flags.double)) {
        results.push(value);
        current = '';
        flags['()'].push(true);
      }
    } else if (value === ')') {
      if (!getLast(flags['()'])) {
        throw prepareError('Unexcepted ).\n');
      }
      if (!getLast(flags.single) && !getLast(flags.double)) {
        if (current) {
          results.push(current);
        }
        results.push(value);
        current = '';
        flags['()'].pop();
      }
    } else if (value === '\'') {
      if (!getLast(flags.single) && !getLast(flags.double)) {
        current = '\'';
        flags.single.push(true);
      } else if (getLast(flags.single)) {
        current += '\'';
        results.push(current);
        current = '';
        flags.single.pop();
      }
    } else if (value === '\"') {
      if (!getLast(flags.single) && !getLast(flags.double)) {
        current = '\"';
        flags.double.push(true);
      } else if (getLast(flags.double)) {
        current += '\"';
        results.push(current);
        current = '';
        flags.double.pop();
      }
    } else if (value === ' ') {
      if (!getLast(flags.single) && !getLast(flags.double)) {
        if (current) {
          results.push(current);
          current = '';
        }
      } else {
        current += ' ';
      }
    } else if (value === '[') {
      if (!getLast(flags.single) && !getLast(flags.double) && !getLast(flags['()'])) {
        results.push(value);
        current = '';
        flags['[]'].push(true);
      }
    } else if (value === ']') {
      if (!getLast(flags['[]'])) {
        throw prepareError('Unexcepted ].\n');
      }
      if (!getLast(flags.single) && !getLast(flags.double) && !getLast(flags['()'])) {
        if (current) {
          results.push(current);
        }
        results.push(value);
        current = '';
        flags['[]'].pop();
      }
    } else {
      current += value;
    }
    index++;
  }

  if (getLast(flags['()'])) {
    throw prepareError('Except ).\n');
  }

  if (getLast(flags['[]'])) {
    throw prepareError('Except ].\n');
  }

  if (getLast(flags.single)) {
    throw prepareError('Except \'.\n');
  }

  if (getLast(flags.double)) {
    throw prepareError('Except ".\n');
  }

  if (current) {
    results.push(current);
  }

  return results;
};
