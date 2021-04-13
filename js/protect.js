'use strict'
window.$$Protect = ({ level = 3 }) => {
  if (!window.$$) window.$$ = ({ $$, $$interface = false }) => {
    if (level >= 1) {
      const protectTypes = [
        'string',
        'number',
        'boolean',
        'bigint',
        'symbol',
        'object'
      ]
      const protectAlertHeaderStyles = () => {
        return [
          'background: #444444',
          'color: #E3E3E3',
          'display: block',
          'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
          'box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
          'font-weight: bold',
          'padding: 2px 15px'
        ].join(';')
      }
      const capitalize = string => (string[0].toUpperCase() + string.slice(1))
      const getInstance = Function.prototype.call.bind(Object.prototype.toString)
      const metadata = $$ => {
        return {
          name: $$ ?.name,
          type: typeof $$,
          instance: getInstance($$).replace('[object ', '').replace(']', ''),
          properties: Object.keys($$ || {}).length ? Object.keys($$) : 0,
          value: Object.values($$ || {}).lenth ? Object.values($$) : $$
        }
      }
      const classCheck = $$ => {
        return typeof $$ === 'function' &&
          /^class\s/.test(Function.prototype.toString.call($$));
      }
      const protectAlert = ($$, property, value, type, message) => {

        console.group('%c=$$= Protect JS', protectAlertHeaderStyles(), `〉〉〉〉 ${level >= 2 ? '🛑 Error!' : '⚠️ Alert!'}`)
        switch (level) {
          case 0:
            return
          case 1:
            console.trace($$)
            console.warn(message)
            return console.groupEnd()
          case 2:
            console.trace($$)
            console.error(message)
            return console.groupEnd()
          case 3:
          default:
            console.trace($$)
            switch (type) {
              case 'type':
                throw new TypeError(message)
              case 'reference':
                throw new ReferenceError(message)
              default:
                return console.error(level, type, message)
            }
        }
      }
      const primitiveHandler = ({ type = false, before = false, after = false }) => {
        return {
          set: ($$, property, value) => {
            if (before)
              value = before(value)
            if (type && typeof value !== type)
              protectAlert($$, property, value, 'type', `The value ${level >= 2 ? 'must' : 'should'} be of type ${type[0].toUpperCase() + type.slice(1)} and you have provided a value of type ${metadata(value).instance}.`)
            if (after) {
              value = new Promise((resolve) => resolve(value)).then(result => {
                return after(result)
              })
            }
            return $$[property] = value
          }
        }
      }
      const arrayHandler = ({ type = false, before = false, after = false }) => {
        return {
          get: ($$, property, receiver) => {
            if (property === 'push') {
              const method = $$[property]
              return (...args) => {
                args.map(arg => {
                  if (typeof arg !== type)
                    protectAlert($$, property, receiver, 'type', `The value ${level >= 2 ? 'must' : 'should'} be of type ${type[0].toUpperCase() + type.slice(1)} and you have provided a value of type ${metadata(receiver).instance}.`)
                })
                method.apply($$, args)
              }
            }
            return $$[property]
          },
          set: ($$, property, value) => {
            if (before)
              value = before(value)
            if (!Array.isArray(value)) {
              protectAlert($$, property, value, 'type', `This value ${level >= 2 ? 'must' : 'should'} be of type Array and you have provided a value of type ${metadata(value).instance}.`)
            }
            if (after) {
              value = new Promise((resolve) => resolve(value)).then(result => {
                return after(result)
              })
            }
            return $$[property] = value
          }
        }
      }
      const objectHandler = ({ type = false, before = false, after = false }) => {
        return {
          get: ($$, property, receiver) => receiver,
          set: ($$, property, value) => {
            return $$[property] = Object.seal(new Proxy({ $$: value }, primitiveHandler({ type: type, before: before, after: after })))
          }
        }
      }
      const functionHandler = ({ types = false, before = false, after = false, returns = false }) => {
        return {
          get: ($$, property, receiver) => {
            const method = receiver
            return (...args) => {
              let results
              if (before) results = before(...args)
              if (results) args[0].$$before = results
              if (after) {
                return new Promise((resolve) => {
                  results = before ? results : $$[property](...args)
                  resolve(results)
                }).then(result => {
                  results = after(result)
                  if (returns) {
                    if (!protectTypes.includes(returns))
                      protectAlert($$, property, value, 'reference', `You may only set the return to a valide type.`)
                    if (typeof results !== returns)
                      protectAlert($$interface, property, value, 'type', `This function ${level >= 2 ? 'must' : 'should'} return a value of type ${capitalize(returns)} and it is instead a value of type ${metadata(results).instance}.`)
                  }
                  return results
                })
              }
              if (returns && typeof results !== returns)
                protectAlert($$, property, receiver, 'type', `This function ${level >= 2 ? 'must' : 'should'} return a value of type ${capitalize(returns)} and it is instead a value of type ${metadata(results).instance}.`)
              results = $$[property](...args)
              return results
            }
          },
        }
      }
      const classHandler = ({ $$interface, $$protected, $$class }) => {
        return {
          get: ($$, property, receiver) => {
            const $$protectedMasterArray = $$protected.properties.concat($$protected.methods)
            const { instance, name = property } = metadata($$[property])
            console.log($$interface[name])
            const protectLevelTerm = level >= 2 ? 'must' : 'should'
            if (!$$interface[name])
              protectAlert($$, name, receiver, 'reference', `This property ${protectLevelTerm} have an existing object of directives within this classes interface: ${name}`)
            if (
              (instance !== 'Object' || instance !== 'Function') &&
              !$$interface[name].type
            )
              protectAlert($$, name, receiver, 'type', `This property ${protectLevelTerm} have its type or declared as an object of directives within this classes interface: ${name}`)
            if (
              (instance === 'Object' || instance === 'Function') &&
              !$$interface[name].types
            )
              protectAlert($$, name, receiver, 'type', `This property ${protectLevelTerm} have its argument's types declared as an object of directives withinin this classes interface: ${name}`)
            if (instance === 'Function' && !$$interface[name].returns)
              protectAlert($$, name, receiver, 'type', `This property ${protectLevelTerm} have its return type declared as a string withinin this property's directives detailed in the class interface: ${name}`)
            if ($$protectedMasterArray.includes(name))
              protectAlert($$, name, receiver, 'reference', `This property ${level >= 2 ? 'can' : 'should'} not be accessed outside of it's classes execution context: ${name}`)

            return $$[name]
          },
          set: ($$, property, value) => {

          }
        }
      }
      const { value, instance, name } = metadata($$)
      const { before = false, after = false, returns = false, types = false } = $$interface
      let maintainTypeCheck
      switch (instance) {
        case 'Boolean':
          return Object.preventExtensions(Object.seal(new Proxy({ $$: new Boolean(value) }, primitiveHandler({ type: 'boolean', before: before, after: after }))))
        case 'String':
          return Object.preventExtensions(Object.seal(new Proxy({ $$: new String(value) }, primitiveHandler({ type: 'string', before: before, after: after }))))
        case 'Number':
          return Object.preventExtensions(Object.seal(new Proxy({ $$: new Number(value) }, primitiveHandler({ type: 'number', before: before, after: after }))))
        case 'BigInt':
          return Object.preventExtensions(Object.seal(new Proxy({ $$: new BigInt(value) }, primitiveHandler({ type: 'bigint', before: before, after: after }))))
        case 'Symbol':
          return Object.preventExtensions(Object.seal(new Proxy({ $$: value }, primitiveHandler({ type: 'symbol', before: before, after: after }))))
        case 'Array':
          maintainTypeCheck = new Set(value.map(i => typeof i)).size <= 1 && value[0] && typeof value[0]
          value.__proto__.push = pushValue => {
            if (maintainTypeCheck && maintainTypeCheck !== typeof pushValue)
              return protectAlert(value, name, value, 'type', `This array takes values of type ${capitalize(maintainTypeCheck)} and you have provided a value of type ${metadata(pushValue).instance}`)
            return value[value.length + 1] = pushValue
          }
          return Object.preventExtensions(Object.seal(new Proxy({ $$: new Proxy(value, primitiveHandler({ type: maintainTypeCheck, before: before, after: after })) }, arrayHandler({ type: maintainTypeCheck, before: before, after: after }))))
        case 'Object':
          maintainTypeCheck = new Set(Array.from(value).map(i => typeof i)).size <= 1 && Object.values(value)[0] && typeof Object.values(value)[0]
          return new Proxy({ $$: new Proxy(value, primitiveHandler({ type: maintainTypeCheck, before: before, after: after })) }, objectHandler)
        case 'Function':
          if (classCheck(value)) {
            return Object.preventExtensions(
              Object.seal(
                {
                  $$: new Proxy(
                    class Protecting extends value {
                      'use strict';
                      constructor() {
                        super()
                        const $$extend = this.$$extend === true
                        const $$log = this.$$log === true
                        const $$access = new Proxy({ $$: false }, primitiveHandler({ type: 'boolean' }))
                        const $$protectCheck = property => {
                          return property.startsWith('$$') || property.startsWith('_$')
                        }
                        const $$protected = {
                          methods: [],
                          properties: []
                        }
                        Object.getOwnPropertyNames(new value).filter(
                          property => {
                            if ($$protectCheck(property))
                              $$protected.properties.push(property)
                            return
                          }
                        )
                        Object.getOwnPropertyNames(value.prototype).filter(
                          property => {
                            if ($$protectCheck(property))
                              $$protected.methods.push(property)
                            return
                          }
                        )
                        if ($$log) {
                          console.group('%c=$$= Protect JS', protectAlertHeaderStyles(), '〉〉〉〉 📑 Log')
                          console.trace('Protected:', $$protected)
                          console.groupEnd()
                        }
                        const $$this = $$extend ? value : Object.preventExtensions(value)
                        return new Proxy(new $$this, classHandler({ $$protectCheck: $$protectCheck, $$interface: $$interface, $$protected: $$protected, $$class: value }))
                      }
                    }, {
                      set: () => {
                        return
                      }
                    }
                  )
                }
              )
            )
          }
          return new Proxy({ $$: value }, functionHandler({ types: types, before: before, after: after, returns: returns }))
        default:
          return
      }
      return metadata
    }
    return { $$: $$ }
  }
}
