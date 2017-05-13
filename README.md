h5observer
--------------

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

A simple observer.


## Usage

### observer()

```js
var data = { a: 1, b: 2};

h5observer.observer(data, function (model, key) {
  console.log(key + ' changed.');
});
```

### arrayObserver()

```js
var array = [];

h5observer.arrayObserver(array, function (model, method, inserted) {
});
```

### objectObserver()

```js
var data = {};

h5observer.objectObserver(data, 'x', function (model, field) {
  console.log(field + ' changed.');
});
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/h5observer
[npm-image]: https://badge.fury.io/js/h5observer.svg
[travis-url]: https://travis-ci.org/zswang/h5observer
[travis-image]: https://travis-ci.org/zswang/h5observer.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/h5observer?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/h5observer/badge.svg?branch=master&service=github