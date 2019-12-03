import { VNode } from 'vue'
import { createCssNamespace } from './NameSpace'
import Tools from './Tools'
import { Vue } from 'vue/types/vue'

const ActiveNoneClassList = [
  'need-click'
].map((item) => createCssNamespace(item))
const ActiveTextClassList = [
  'nav-bar-left',
  'nav-bar-right'
].map((item) => createCssNamespace(item))
const ActiveBackgrounrClassList = [].map((item) => createCssNamespace(item))
const ActiveAllClassList = [
  'nav-button'
].map((item) => createCssNamespace(item))

// const ActivableTagList = [
//     'a',
//     'button'
// ];

const DisableActiveClassList = [
  'not-show-active'
].map((item) => createCssNamespace(item))

enum LElementActiveType {
    None,
    Text,
    Background,
    All
}

export class LElementStateManager {
    private readonly ele: Element|null;
    private readonly canActive:Boolean;
    private readonly activeType:LElementActiveType;
    private readonly activeClassName:string;

    constructor (touchEle: Element) {
      const { ele, canActive, activeType } = this.findActiveElement(touchEle)
      this.ele = ele
      this.canActive = canActive
      this.activeType = activeType
      this.activeClassName = this.getActiveClassName()
    }

    private findActiveElement (ele: Element|null): {ele:Element|null, canActive:boolean, activeType:LElementActiveType} {
      if (!ele) {
        return {
          ele: null,
          canActive: false,
          activeType: LElementActiveType.None
        }
      }
      const className = ele.className
      if (!className) {
        return this.findActiveElement(ele.parentElement)
      }
      for (let idx = 0; idx < DisableActiveClassList.length; idx++) {
        const disableActiveClassName = DisableActiveClassList[idx]
        if (className.indexOf(disableActiveClassName) > -1) {
          return {
            ele: ele,
            canActive: false,
            activeType: LElementActiveType.None
          }
        }
      }
      for (let idx = 0; idx < ActiveAllClassList.length; idx++) {
        const activeClassName = ActiveAllClassList[idx]
        if (className.indexOf(activeClassName) > -1) {
          return {
            ele: ele,
            canActive: true,
            activeType: LElementActiveType.All
          }
        }
      }
      for (let idx = 0; idx < ActiveTextClassList.length; idx++) {
        const activeClassName = ActiveTextClassList[idx]
        if (className.indexOf(activeClassName) > -1) {
          return {
            ele: ele,
            canActive: true,
            activeType: LElementActiveType.Text
          }
        }
      }
      for (let idx = 0; idx < ActiveBackgrounrClassList.length; idx++) {
        const activeClassName = ActiveBackgrounrClassList[idx]
        if (className.indexOf(activeClassName) > -1) {
          return {
            ele: ele,
            canActive: true,
            activeType: LElementActiveType.Background
          }
        }
      }
      for (let idx = 0; idx < ActiveNoneClassList.length; idx++) {
        const activeClassName = ActiveNoneClassList[idx]
        if (className.indexOf(activeClassName) > -1) {
          return {
            ele: ele,
            canActive: true,
            activeType: LElementActiveType.None
          }
        }
      }
      return this.findActiveElement(ele.parentElement)
    }

    private getActiveClassName ():string {
      let activeClassName = ''
      switch (this.activeType) {
        case LElementActiveType.All:
          activeClassName = createCssNamespace('active-state')
          break
        case LElementActiveType.Text:
          activeClassName = createCssNamespace('active-state-text')
          break
        case LElementActiveType.Background:
          activeClassName = createCssNamespace('active-state-background')
          break
        case LElementActiveType.None:
          activeClassName = ''
          break
      }
      return activeClassName
    }

    active () {
      if (!this.ele) return
      if (!this.canActive) return
      const className = this.ele.className
      if (className && this.activeClassName) {
        this.ele.className = `${className} ${this.activeClassName}`
      }
    }

    deactive () {
      if (!this.ele) return
      if (!this.canActive) return
      const className = this.ele.className
      if (className && this.activeClassName) {
        this.ele.className = className.replace(` ${this.activeClassName}`, '')
      }
    }
}

const pageTransitionClass = createCssNamespace('page-animation')
export const LPageTransitionManager = {
  addTransitionClassToPage (...pages:(VNode | undefined)[]) {
    pages.forEach(page => {
      if (!page) return
      const ele:Element = <Element><any>page.elm
      Tools.addClass(ele, pageTransitionClass)
    })
  },
  removeTransitionClassToPage (...pages:(VNode | undefined)[]) {
    pages.forEach(page => {
      if (!page) return
      const ele:Element = <Element><any>page.elm
      Tools.removeClass(ele, pageTransitionClass)
    })
  },
  animation (ele:Element|undefined, transitionSetter:{():void} | undefined, animationEndHandler:{():void}| undefined) {
    if (!ele || ele.className.indexOf(pageTransitionClass) < 0) return
    if (typeof transitionSetter !== 'function') return
    if (typeof animationEndHandler === 'function') {
      const animationEndCallback = () => {
        animationEndHandler()
        ele.removeEventListener('transitionend', animationEndCallback)
      }
      ele.addEventListener('transitionend', animationEndCallback)
    }
    transitionSetter()
  }
}

/**
 * route hook to fix v
 */
export const LRouterHook = {
  fixOldPagePatch (app:VNode|undefined, oldPage:VNode|undefined) {
    if (!(app && app.context && oldPage && oldPage.componentInstance)) return
    // @ts-ignore
    const appOldNode = <VNode>(app.context._vnode)
    const oldChildren = appOldNode.children || []
    if (oldChildren.indexOf(oldPage) >= 0) return
    if (!appOldNode.children) appOldNode.children = []
    const copyPage = <VNode>{}
    Object.assign(copyPage, oldPage)
    const appEl = app.context.$el
    if (copyPage.elm && (!copyPage.elm.parentNode)) {
      oldChildren.unshift(copyPage)
      appEl.insertBefore(copyPage.elm, appEl.children[0])
    }
  },
  activePage (pageInstance:Vue|undefined) {
    if (!pageInstance) return
    // @ts-ignore
    pageInstance._inactive = false
    // @ts-ignore
    pageInstance._directInactive = false
    const activatedList = pageInstance.$options.activated
    // @ts-ignore
    activatedList && activatedList.forEach(activated => {
      activated && activated.call(pageInstance)
    })
    pageInstance.$children && pageInstance.$children.forEach(childInstance => {
      this.activePage(childInstance)
    })
    this._freshDevTool()
  },
  deactivePage (pageInstance:Vue|undefined) {
    if (!pageInstance) return
    // @ts-ignore
    pageInstance._inactive = true
    // @ts-ignore
    pageInstance._directInactive = true
    const deactivatedList = pageInstance.$options.deactivated
    // @ts-ignore
    deactivatedList && deactivatedList.forEach(deactivated => {
      deactivated && deactivated.call(pageInstance)
    })
    pageInstance.$children && pageInstance.$children.forEach(childInstance => {
      this.deactivePage(childInstance)
    })
    this._freshDevTool()
  },
  _freshDevTool () {
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore
      const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
      if (devtools) {
        devtools.emit('flush')
      }
    }
  }
}
