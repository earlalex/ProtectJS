'use strict';
$$Protect({ level: 1 })

const test = $$({
  $$interface:{
    publicProperty: {
      berfore: beforeArgs => beforeArgs,
      after: afterArgs => afterArgs,
      type: 'boolean'
    },
    $$protectedProperty: {
      berfore: beforeArgs => beforeArgs,
      after: afterArgs => afterArgs,
      type: 'boolean'
    },
    publicMethod: {
      berfore: beforeArgs => beforeArgs,
      after: afterArgs => afterArgs,
      types: {},
      returns: 'boolean'
    },
    $$protectedMethod: {
      berfore: beforeArgs => beforeArgs,
      after: afterArgs => afterArgs,
      types: {},
      returns: 'boolean'
    }
  },
  $$: class MyClass {
    constructor() {
      this.$$log = true
      this.$$extend = true
      this.publicProperty = true
      this.$$protectedProperty = true
    }
    publicMethod({}){
      return true
    }
    $$protectedMethod({}) {
      return true
    }
  }
})

const MyClass = new test.$$

console.log(MyClass.$$protectedProperty)