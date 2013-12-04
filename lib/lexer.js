// 词法分析器
// 从源代码中扫描出Tokens
exports.scan = function (content) {
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
        if (current) {
          results.push(current);
        }
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
      if (!flags['single'] && !flags['double'] && !flags['()']) {
        results.push(current);
        current = '';
      }
    }
    index++;
  }
  return results;
};
