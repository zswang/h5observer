/**
 * 触发函数
 *
 * @param model 绑定的数据
 */
export interface ObjectObserverTriggerFunction {
  (model: object, key: string)
}

export interface ArrayObserverTriggerFunction {
  (model: any[], method: string, inserted: any[])
}

export interface ObserverTriggerFunction {
  (model: any, keyOrMethod: string, inserted?: any[])
}

/**
 * 过滤函数
 *
 * @param key 键值名
 */
export interface FilterFunction {
  (key: string): boolean
}

/*<function name="objectObserver">*/
/**
 * 监听字段的变化
 *
 * @param model 数据对象
 * @param field 字段名
 * @param trigger 触发函数
 * @example objectObserver():base
  ```js
  var data = {};
  var log = '';
  h5observer.objectObserver(data, 'x', function (model, field) {
    log += field + '=' + model.x + ';';
  });
  data.x = 1;
  console.log(log);
  // > x=1;

  data.x = 2;
  console.log(log);
  // > x=1;x=2;

  data.x = 2;
  console.log(log);
  // > x=1;x=2;
  ```
 */
function objectObserver(model: object, field: string, trigger: ObjectObserverTriggerFunction) {
  var property = Object.getOwnPropertyDescriptor(model, field);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  let getter = property && property.get
  let setter = property && property.set

  let value = model[field]

  Object.defineProperty(model, field, {
    enumerable: true,
    configurable: true,
    get: () => {
      return getter ? getter.call(model) : value
    },
    set: (newVal: any) => {
      var val = getter ? getter.call(model) : value
      if (newVal === val) {
        return
      }
      if (setter) {
        setter.call(model, newVal)
      } else {
        value = newVal
      }
      trigger(model, field)
    }
  })
} /*</function>*/

/*<function name="arrayObserver">*/
/**
 * 监听数组的变化
 *
 * @param model 数据对象
 * @param trigger 触发函数
 * @example arrayObserver():base
  ```js
  var data = [];
  var log = '';
  h5observer.arrayObserver(data, function (data, method, inserted) {
    log += 'method=' + method + ' inserted=' + JSON.stringify(inserted) + ';';
  });
  data.push(1, 2);
  console.log(log);
  // > method=push inserted=[1,2];

  data.splice(1, 0, 'a', 'b');
  console.log(log);
  // > method=push inserted=[1,2];method=splice inserted=["a","b"];

  data.sort();
  console.log(log);
  // > method=push inserted=[1,2];method=splice inserted=["a","b"];method=sort inserted=null;
  ```
 */
function arrayObserver(model: any[], trigger: ArrayObserverTriggerFunction) {
  [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse',
  ]
    .forEach((method) => {
      // cache original method
      let original = model[method]

      Object.defineProperty(model, method, {
        value: function (...args) {
          var result = original.apply(this, args)

          let inserted = null
          switch (method) {
            case 'push':
            case 'unshift':
              inserted = args
              break
            case 'splice':
              inserted = args.slice(2)
              break
          }

          trigger(model, method, inserted)
          return result
        },
        enumerable: false,
        writable: true,
        configurable: true,
      })
    })
} /*</function>*/

/*<function name="observer" depend="objectObserver,arrayObserver">*/
/**
 * 监听数据改变
 *
 * @param model 数据
 * @param trigger 触发函数
 * @example observer():trigger is undefined
  ```js
  var data = { a: 1 };
  h5observer.observer(data);
  h5observer.observer(null);
  ```
 * @example observer():trigger
  ```js
  var data = { a: 1 };
  h5observer.observer(data, function () {
    console.log(data.a);
  });
  data.a = 2;
  // > 2
  ```
 * @example observer():filter
  ```js
  var data = { a: 1, b: 1 };
  var count = 0;
  h5observer.observer(data, function () {
    count++;
  }, function (key) {
    return key === 'a';
  });
  data.a = 2;
  console.log(count);
  // > 1

  data.a = 2;
  console.log(count);
  // > 1

  data.b = 2;
  console.log(count);
  // > 1
  ```
 * @example observer():configurable is false
  ```js
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
  console.log(i);
  // > 0
  ```
 * @example observer():getter/setter
  ```js
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
  console.log(data.x);
  // > 123
  ```
 * @example observer():array
  ```js
  var data = [1, 2, 3];
  var count = 0;
  h5observer.observer(data, function () {
    count++;
  });
  data.push(4);
  console.log(count);
  // > 1

  data.sort();
  console.log(count);
  // > 2
  ```
 */
function observer(model: any, trigger: ObserverTriggerFunction, filter?: FilterFunction) {
  if (!trigger) {
    return
  }
  if (Array.isArray(model)) {
    arrayObserver(model, trigger)
  } else if (typeof model === 'object' && model) {
    Object.keys(model).forEach((key) => {
      if (filter && !filter(key)) {
          return
      }
      objectObserver(model, key, trigger)
    })
  }
} /*</function>*/

export {
  objectObserver,
  arrayObserver,
  observer,
}
