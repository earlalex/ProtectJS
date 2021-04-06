window.__Protect__ = (__Extend__ = false, BaseClass) => {
  if (BaseClass.prototype.constructor)
    return class ProtectedClass extends BaseClass {
      constructor() {
        super()

        let __ProtectedAccess__ = false

        const __ErrorMessages__ = {
          type: {
            __default: 'must be type',
            parameter: 'is not a specified named argument or is not specified in the class interface',
            interface: 'types can not be determined. There must be an interface object with your methods declared in the class constuctor',
            effects: 'must be a function',
            __return: 'must return type',
            arguments: 'must have an object of parameter types specified in the class interface',
          },
          reference: {
            __default: 'Protected properties may not be accessed or set from outside of its class execution context',
            arguments: 'You must provide an object of named arguments in',
          },
          // log: {
          //   openError: 'Failed to open indexedDB',
          // }
        }

        const __Types__ = [
          'undefined',
          'boolean',
          'number',
          'string',
          'bigint',
          'symbol',
          'object',
          'function',
          'any',
          '*',
          'null'
        ]

        const __ClassName__ = this.name
        const __DateTime__ = () => new Date().toString()
        const __Version__ = this.__Version__ || 1
        const __DocumentTitle__ = document.title
        const __LastModified__ = document.lastModified
        const __ClassID__ = this.__ClassID__ ||
          btoa(`${
            __Version__
            }:${
            __DocumentTitle__
            }:${
            __ClassName__
            }`
            .replace(/[^A-Z0-9]/ig, "_")
          )
        const __Debug__ = this.__Debug__ === true
        const __IDBName__ = `Protect-${__DocumentTitle__}`
        const __ReferenceError__ = (
          __Property__,
          message = __ErrorMessages__
            .reference
            .__default
        ) => {

          throw new ReferenceError(`${message}: ${__Property__}`)
        }
        const __TypeError__ = (
          __Property__,
          type,
          message = __ErrorMessages__
            .type
            .__default
        ) => {

          throw new TypeError(`${
            typeof __Property__ === 'string' ?
              __Property__ :
              __Property__.name
            } ${message}: ${
            typeof type === 'string' ?
              type :
              typeof type
            }`)
        }
        const __ParameterCheck__ = (name, parameter, type) => {

          if (!__Types__.includes(type))

            __TypeError__(
              name,
              type,
              __ErrorMessages__
                .type
                .parameter
            )

          if (type === '*' || type === 'any')
            return true

          if (
            typeof parameter === 'undefined' ||
            typeof parameter !== 'function' &&
            parameter.length === 0
          ) return false

          if (
            typeof parameter === String(type) ||
            typeof type === 'object' &&
            parameter instanceof type
          )
            return true

          return false
        }
        const __ProtectCheck__ = (__Property__) => {

          if (__Property__.indexOf('__') === 0)
            return true

          return false
        }
        const __Protect__ = {
          Methods: [],
          Properties: []
        }

        Object
          .getOwnPropertyNames(this)
          .filter(
            __Property__ => {

              if (__ProtectCheck__(__Property__))
                __Protect__.Properties.push(__Property__)

              return
            }
          )
        Object
          .getOwnPropertyNames(BaseClass.prototype)
          .filter(
            __Property__ => {

              if (__ProtectCheck__(__Property__))
                __Protect__.Methods.push(__Property__)
              return
            }
          )
        const __Protected__ = Object.freeze(__Protect__)
        const __Handler__ = this.__Handler__ || {

          get: (__Target__, __Property__) => {

            if (
              __Protected__
                .Properties
                .includes(__Property__) &&
              !__ProtectedAccess__
            )
              __ReferenceError__(__Property__)

            if (
              __Protected__
                .Methods
                .includes(__Property__) &&
              !__ProtectedAccess__
            )
              __ReferenceError__(__Property__)

            if (
              __ParameterCheck__(
                __Property__,
                this[__Property__],
                'function'
              )
            ) {

              if (__ProtectCheck__(__Property__))
                __ReferenceError__(
                  __Property__,
                  __ErrorMessages__
                    .reference
                    .__default)

              const __Method__ = this[__Property__]

              let __ArgTypes__ = false

              let __BeforeEffectCheck__ = false,
                __AfterEffectCheck__ = false,
                __ReturnTypeCheck__ = false,
                __BeforeEffect__,
                __AfterEffect__

              if (
                !this.__Interface__ &&
                !Object.keys(this.__Interface__)
                  .length !== 0 &&
                !this.__Interface__[__Property__]
              )
                __TypeError__(
                  __Property__,
                  'undefined',
                  __ErrorMessages__
                    .type
                    .interface
                )


              __ArgTypes__ = this.__Interface__[__Property__]

              if (
                !__ParameterCheck__(
                  __Property__,
                  __ArgTypes__,
                  'object'
                )
              )
                __TypeError__(
                  __Property__,
                  'undefined',
                  __ErrorMessages__
                    .type
                    .interface
                )

              if (__ArgTypes__.__before) {


                if (
                  !__ParameterCheck__(
                    '__before',
                    __ArgTypes__
                      .__before,
                    'function'
                  )
                )
                  __TypeError__(
                    '__before',
                    __ArgTypes__
                      .__before,
                    __ErrorMessages__
                      .type
                      .effects
                  )

                __BeforeEffect__ = __ArgTypes__
                  .__before
                __BeforeEffectCheck__ = true
              }

              if (
                __ArgTypes__
                  .__return
              ) {
                if (
                  !__ParameterCheck__(
                    '__return',
                    __ArgTypes__
                      .__return,
                    'string'
                  ) &&
                  !__Types__
                    .includes(
                      __ArgTypes__
                        .__return
                    )
                )
                  __TypeError__(
                    '__return',
                    __ArgTypes__
                      .__return,
                    __ErrorMessages__
                      .type
                      .__return
                  )
              }

              if (__ArgTypes__.__after) {
                if (
                  !__ParameterCheck__(
                    '__after',
                    __ArgTypes__
                      .__after,
                    'function'
                  )
                )
                  __TypeError__(
                    '__after',
                    __ArgTypes__
                      .__after,
                    __ErrorMessages__
                      .type
                      .effects
                  )
              }

              return (...args) => {

                __ProtectedAccess__ = true

                if (args.length === 0)
                  __ReferenceError__(
                    __Property__,
                    __ErrorMessages__
                      .reference
                      .arguments
                  )


                if (__ArgTypes__)
                  Object
                    .keys(args[0])
                    .map(
                      __Arg__ => {

                        if (
                          !__ParameterCheck__(
                            __Arg__,
                            args[0][__Arg__],
                            __ArgTypes__[__Arg__]
                          )
                        )

                          __TypeError__(
                            __Arg__,
                            __ArgTypes__[__Arg__],
                            __ErrorMessages__
                              .type
                              .parameter
                          )
                      }
                    )

                let __ApplyArgs__ = [...args]

                if (__BeforeEffectCheck__) {

                  const __BeforeResults__ = __BeforeEffect__(...args)

                  __ApplyArgs__ = [...args, __BeforeResults__]
                }

                let __Results__ = __Method__
                  .apply(
                    this,
                    __ApplyArgs__
                  )

                if (
                  !__ParameterCheck__(
                    __Property__,
                    __Results__,
                    __ArgTypes__.__return
                  )
                )
                  __TypeError__(
                    __Property__,
                    __ArgTypes__.__return,
                    __ErrorMessages__.type.__return
                  )

                if (__AfterEffectCheck__)
                  __Results__ = __AfterEffect__(__Results__)

                __ProtectedAccess__ = false

                return __Results__

              }
            }

            return this[__Property__]
          },

          set: (__Target__, __Property__, __Value__) => {

            if (
              __ParameterCheck__(
                __Property__,
                this[__Property__],
                'function'
              ) ||
              __ProtectCheck__(__Property__)
            )
              __ReferenceError__(
                __Property__,
                __ErrorMessages__
                  .reference
                  .__default
              )

            return this[__Property__] = __Value__
          }
        }

        if (__Debug__)
          console.info('__Protected__', __Protected__)

        const __ProtectedClass__ = new Proxy(this, __Handler__)

        return Object
          .freeze(
            Object.seal(
              __Extend__ ?
                __ProtectedClass__ :
                Object.preventExtensions(
                  __ProtectedClass__
                )
            )
          )
      }
    }
  return new TypeError(`You must provide a class: ${BaseClass.name || 'undefined'}`)
}