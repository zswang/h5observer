
global.h5observer = require('../h5observer.js');
      

describe("src/ts/observer.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("objectObserver():base", function () {
    examplejs_printLines = [];
  var data = {};
  var log = '';
  h5observer.objectObserver(data, 'x', function (model, field) {
    log += field + '=' + model.x + ';';
  });
  data.x = 1;
  examplejs_print(log);
  assert.equal(examplejs_printLines.join("\n"), "x=1;"); examplejs_printLines = [];

  data.x = 2;
  examplejs_print(log);
  assert.equal(examplejs_printLines.join("\n"), "x=1;x=2;"); examplejs_printLines = [];

  data.x = 2;
  examplejs_print(log);
  assert.equal(examplejs_printLines.join("\n"), "x=1;x=2;"); examplejs_printLines = [];
  });
          
  it("arrayObserver():base", function () {
    examplejs_printLines = [];
  var data = [];
  var log = '';
  h5observer.arrayObserver(data, function (data, method, inserted) {
    log += 'method=' + method + ' inserted=' + JSON.stringify(inserted) + ';';
  });
  data.push(1, 2);
  examplejs_print(log);
  assert.equal(examplejs_printLines.join("\n"), "method=push inserted=[1,2];"); examplejs_printLines = [];

  data.splice(1, 0, 'a', 'b');
  examplejs_print(log);
  assert.equal(examplejs_printLines.join("\n"), "method=push inserted=[1,2];method=splice inserted=[\"a\",\"b\"];"); examplejs_printLines = [];

  data.sort();
  examplejs_print(log);
  assert.equal(examplejs_printLines.join("\n"), "method=push inserted=[1,2];method=splice inserted=[\"a\",\"b\"];method=sort inserted=null;"); examplejs_printLines = [];
  });
          
  it("observer():trigger is undefined", function () {
    examplejs_printLines = [];
  var data = { a: 1 };
  h5observer.observer(data);
  h5observer.observer(null, function () {});
  });
          
  it("observer():trigger", function () {
    examplejs_printLines = [];
  var data = { a: 1 };
  h5observer.observer(data, function () {
    examplejs_print(data.a);
  });
  data.a = 2;
  assert.equal(examplejs_printLines.join("\n"), "2"); examplejs_printLines = [];
  });
          
  it("observer():filter", function () {
    examplejs_printLines = [];
  var data = { a: 1, b: 1 };
  var count = 0;
  h5observer.observer(data, function () {
    count++;
  }, function (key) {
    return key === 'a';
  });
  data.a = 2;
  examplejs_print(count);
  assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

  data.a = 2;
  examplejs_print(count);
  assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

  data.b = 2;
  examplejs_print(count);
  assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];
  });
          
  it("observer():configurable is false", function () {
    examplejs_printLines = [];
  var data = { a: 1 };
  Object.defineProperty(data, 'a', {
    enumerable: true,
    configurable: false,
  });
  var i = 0;
  h5observer.observer(data, function () {
    i = 1;
  });
  data.a = 2;
  examplejs_print(i);
  assert.equal(examplejs_printLines.join("\n"), "0"); examplejs_printLines = [];
  });
          
  it("observer():getter/setter", function () {
    examplejs_printLines = [];
  var data = { a: 1 };
  var _x = 0;
  Object.defineProperty(data, 'x', {
    enumerable: true,
    configurable: true,
    get: function () {
      return _x;
    },
    set: function (value) {
      _x = value;
    }
  });
  h5observer.observer(data, function () {});
  data.x = 123;
  examplejs_print(data.x);
  assert.equal(examplejs_printLines.join("\n"), "123"); examplejs_printLines = [];
  });
          
  it("observer():array", function () {
    examplejs_printLines = [];
  var data = [1, 2, 3];
  var count = 0;
  h5observer.observer(data, function () {
    count++;
  });
  data.push(4);
  examplejs_print(count);
  assert.equal(examplejs_printLines.join("\n"), "1"); examplejs_printLines = [];

  data.sort();
  examplejs_print(count);
  assert.equal(examplejs_printLines.join("\n"), "2"); examplejs_printLines = [];
  });
          
});
         