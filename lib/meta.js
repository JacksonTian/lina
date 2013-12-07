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

module.exports = meta;
