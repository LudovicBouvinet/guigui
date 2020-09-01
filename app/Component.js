import Renderable from './Renderable'

export default class Component extends Renderable {
  constructor (object, property, options = {}, domString = '') {
    options.classNames = options.classNames || []
    options.classNames.push('guigui-component')

    if (!object) {
      throw new Error('Cannot create a component around a non object')
    }

    super(options, domString)

    this.dispose = this.dispose.bind(this)
    this.onWatch = this.onWatch.bind(this)
    this.isWatched = options.watch === true

    this._targetObject = object
    this._targetProperty = property
    this._value = object[property]
    this._events = []

    this.onEndInteraction()
  }

  on (type, handler) {
    if (!this._events[type]) {
      this._events[type] = []
    }
    this._events[type].push(handler)
  }

  off (type, handler) {
    if (this._events[type]) {
      this._events[type].splice(this._events[type].indexOf(handler) >>> 0, 1)
    }
  }

  emit (type, evt) {
    (this._events[type] || []).slice().map(handler => {
      handler(evt)
    })
  }

  invalidate () {
    this._value = this._targetObject[this._targetProperty]
  }

  onWatch () {
    if (this._targetObject[this._targetProperty] !== this._value) {
      this.invalidate()
    }
  }

  onStartInteraction () {
    if (this.isWatched) {
      clearInterval(this._watchInterval)
    }
  }

  onEndInteraction () {
    if (this.isWatched) {
      this._watchInterval = setInterval(this.onWatch, 100)
    }
  }

  dispose () {
    this.remove()

    this.isWatched = false 

    clearInterval(this._watchInterval)

    this._targetObject = null
    this._targetProperty = null
    this._value = null

    this._events = []
  }
}
