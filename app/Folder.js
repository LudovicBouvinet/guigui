import createComponent from './createComponent'
import Renderable from './Renderable'
import { toggleClass, addClass, removeClass } from './utils/dom'
import ColorPicker from './components/Colorpicker'

export default class Folder extends Renderable {
  constructor (folderName, options, domString = undefined) {
    options.classNames = options.classNames || ['guigui-folder']

    domString = domString ||
      `
      <div class="guigui-folder-head">
        <h2 class="guigui-folder-label">${folderName}</h2>
        <div class="guigui-folder-toggle">
          <div class="guigui-folder-toggle-line"></div>
          <div class="guigui-folder-toggle-line"></div>
        </div>
      </div>
      <div class="guigui-folder-content"></div>
    `

    super(options, domString)

    this.toggle = this.toggle.bind(this)
    this.dispose = this.dispose.bind(this)

    this.folderName = folderName
    this.components = []
    this.folders = []

    this.$content = this.$el.querySelector('.' + options.classNames[0] + '-content')
    this.$head = this.$el.querySelector('.' + options.classNames[0] + '-head')
    this.$head.addEventListener('click', this.toggle)
  }

  dispose () {
    this.$head.removeEventListener('click', this.toggle)

    this.folders.forEach(folder => folder.dispose())
    this.components.forEach(component => component.dispose())

    this.$content = null
    this.$head = null
    this.folderName = null
    this.folders = null
    this.components = null
  
    this.remove()
  }

  toggle () {
    toggleClass(this.$el, this.classNames[0] + '--opened')
  }

  close () {
    removeClass(this.$el, this.classNames[0] + '--opened')
  }

  open () {
    addClass(this.$el, this.classNames[0] + '--opened')
  }

  addFolder (name, options = {}) {
    const folder = new Folder(name, options)
    this.folders.push(folder)
    folder.appendTo(this.$content)
    return folder
  }

  removeFolder (name = '') {
    let folders = this.folders
    const folder = folders.filter(folder => {
      return folder.folderName === name
    })[0]

    const index = folders.indexOf(folder)
    if (index > -1) {
      folders[index].dispose()
      delete folders[index]
      folders.splice(index, 1)
    }

    this.folders = folders
  }

  add (object, property, array, options) {
    const component = createComponent(object, property, array, options)
    this.components.push(component)
    component.appendTo(this.$content)
    return component
  }

  addColor (object, property, options) {
    const component = new ColorPicker(object, property, options)
    this.components.push(component)
    component.appendTo(this.$content)
    return component
  }

  addColorPicker (...args) {
    return this.addColor(...args)
  }

  removeComponent(slug) {
    let components = this.components
    const component = components.filter(component => {
      return component.slug === slug
    })[0]

    const index = components.indexOf(component)
    if (index > -1) {
      components[index].dispose()
      components.splice(index, 1)
    }

    this.components = components
  }
}
