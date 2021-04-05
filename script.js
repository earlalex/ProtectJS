console.log(`Link ProtectJS directly in the head of your html using the attribute async.`)
/* 
- ProtectJS is a dynamic type checking and enforcement class decorator.
- A protected class can only be instanciated using the new reserved word.
- The first parameter must be a boolean value determining if the protected class can be extended.
- Protected methods and properties by adding double underscores ( __ ) to the beginning of their name.
*/
const Class = __Protect__(true, class Class {
  constructor() {

    console.log('*',`Debugging: You can enable debuging which will print out the class's protected properties and methods in the console.`)
    this.__Debug__ = true

    console.log('*',`Interface: Declare the class interface for method types in the constructer as an object.`)
    this.__Interface__ = {

      // Use the method name as a property of the interface.
      publicMethod: {

        // Before Effect: This function will run before the function called and will pass along it's returned results as an argument out side of name arguments object.
        __before: params => {
          return params
        },

        // After Effect: This function will run after the function called and will have the results of the called function as it's only argument.
        __after: results => results,

        // Parameter Type Check: the named argment's name must be the key and the value must a value JS type. You may use *, any or do not specify the named argument as a property to disable type checking.
        string1: 'string',

        // Return Type Check: This is how you specifiy the type that must be returned from the function called. Before and after effects can return any type.
        __return: 'string'
      },

      // Example of a protected method property declared within the interface. Same as above.
      __protectedMethod: {
        __return: 'function'
      },

      // This method does not take any arguments but you still need to specify the return type.
      publicInterface: {
        __return: 'object'
      }
    }

    console.log('*','publicProperty, publicMethod',` can be accessed outside of the class.`)
    this.publicProperty = true

    console.log('*','__protectedProperty, __protectedMethod',` are protected and can not be accessed outside of the class.`)
    this.__protectedProperty = false
  }

  // You can expose protected values but not set them out side of the classes context.
  publicInterface({ }, bypass) {
    console.log(bypass)
    return this.__Interface__
  }

  // This method can be access outside of the class.
  publicMethod({ string1 }, beforeEffectResult) {

    console.log('*','Private methods and properties are accessible inside of public methods.')
    this.__protectedMethod({ before: beforeEffectResult })

    console.log('*','publicMethod','return type is set to string in the interface.')
    return string1
  }

  // This method is not accessble outside of this class.
  __protectedMethod({ before }) {

    console.log('*','__protectedMethod','returns type is set to function in the interface.')
    return console.info('- __protectedMethod:', before,'< This protected method is console logging the computed results of the method called while within the method being called using a "Before Effect". Inception!')
  }
}
)

/*
 Examples below:
*/
console.log('*','You can instanciate a new instance or extand.')
class Protected extends Class {
  constructor() {
    super()

    console.log('*','In an extended class you inhereit the properties and methods but you can not set or change them.')
    // this.publicProperty = false
  }
}

console.log('*',`Creating a new class to have access to extended methods and properties.`)
Protected = new Protected

// Grouping console logs for clarity.
console.group('Access Tests')

console.log('Example: Public methods and properties are accessible.')
console.info('- publicProperty:', Protected.publicProperty)

console.log('Example: All methods must use named arguments or pass in an empty object.')
console.info('- publicMethod:', Protected.publicMethod({ string1: 'some text' }))

console.log('Example: You can expose private properties through public functions and also choose to bypass the type checking system.')
console.info('- publicInterface:', Protected.publicInterface({}, '- You can bypass the type checking system but you must still obey return types.'))

console.log('Example: Protected methods and properties are not accessible.')
console.info('__protectedProperty', Protected.__protectedProperty)
// console.info('__protectedMethod',Protected.__protectedMethod({before:'yo'}))
// console.info('- __Interface__:',Protected.__Interface__)

// End console log grouping.
console.groupEnd()