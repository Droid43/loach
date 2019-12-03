import { LApp } from './LApp'
import { LElementStateManager } from './TransitionModule'

enum LTouchType {
    None,
    Single,
    Multiple,
    GestureBack
}

export interface LTouchBackEvent {
    touchBackStart(): void;
    touchBackMove(moveOffset: Number): void;
    touchBackFinish(canBack: Boolean): void;
}

export class LTouch {
    private static __LTouch: LTouch;
    private touchType = LTouchType.None;
    private ele!: HTMLElement;
    public delegate!: LTouchBackEvent;
    public touchStartX = 0;
    public touchStartTime = 0;
    private clickStateManager!: LElementStateManager;

    constructor () {
      LTouch.__LTouch = this
    }

    bindElement (ele: Element | any) {
      if (this.ele) {
        this.ele.removeEventListener('touchstart', LTouch.userTouchStart)
        this.ele.removeEventListener('touchmove', LTouch.userTouchMove)
        this.ele.removeEventListener('touchend', LTouch.userTouchEnd)
        this.ele.removeEventListener('touchcancel', LTouch.userTouchCancel)
      }
      ele.addEventListener('touchstart', LTouch.userTouchStart, false)
      ele.addEventListener('touchmove', LTouch.userTouchMove)
      ele.addEventListener('touchend', LTouch.userTouchEnd)
      ele.addEventListener('touchcancel', LTouch.userTouchCancel)
      this.ele = ele
    }

    // private static elementTypeList(e: Element) {
    //     let nodeType = [e.className];
    //     if(e.parentElement){
    //         return nodeType.concat(LTouch.elementTypeList(e.parentElement));
    //     }
    //     return nodeType;
    // }

    // private static getCanClickElement(e: Element) {
    //     let canClick = e.className.indexOf('loach-need-click') > -1;
    //     if(canClick) return e;
    //     if(e.parentElement){
    //         return LTouch.getCanClickElement(e.parentElement);
    //     }
    // }

    private static userTouchStart (e: TouchEvent) {
      const self = LTouch.__LTouch
      const touchList = e.touches
      if (touchList.length !== 1) {
        if (self.touchType === LTouchType.None) {
          self.touchType = LTouchType.Multiple
          console.log('Multiple')
        }
        return
      }
      if (LApp.getInstance().isPageTransition()) {
        e.preventDefault()
        return
      }
      // console.log('userTouchStart', e.target);
      // console.log('userTouchStart', e.target.__vue__);
      // console.log('userTouchStart', e);
      const touch = touchList[0]
      // console.log('userTouchStart', touch.clientX, touch.clientY);
      self.touchStartX = touch.clientX
      self.touchStartTime = new Date().getTime()
      const gestureStartMaxOffset = 10
      if (touch.clientX < gestureStartMaxOffset) {
        self.touchType = LTouchType.GestureBack
        if (self.delegate) {
          self.delegate.touchBackStart()
        }
        console.log('GestureBack preventDefault')
        e.preventDefault()
        return
      }
      self.touchType = LTouchType.Single
      self.clickStateManager = new LElementStateManager(<Element><any>(e.target))
      self.clickStateManager.active()
      // LTouch.singleTouchStart(e);
    }

    private static userTouchMove (e: TouchEvent) {
      // console.log('userTouchMove');
      const self = LTouch.__LTouch
      // console.log('touchList',e);
      const touchList = e.touches
      if (touchList.length !== 1) {
        return
      }
      const touch = touchList[0]
      let moveOffset = touch.clientX - self.touchStartX
      const maxOffset = self.ele.clientWidth
      moveOffset = moveOffset < 0 ? 0 : moveOffset
      moveOffset = moveOffset > maxOffset ? maxOffset : moveOffset
      // console.log(moveOffset);
      if (self.touchType === LTouchType.GestureBack && self.delegate) {
        self.delegate.touchBackMove(moveOffset)
      }
      if (self.touchType === LTouchType.Single && moveOffset > 5) {
        self.clickStateManager.deactive()
      }
    }

    private static userTouchEnd (e: TouchEvent) {
      // console.log('userTouchEnd');
      const self = LTouch.__LTouch
      const touchList = e.changedTouches
      if (touchList.length !== 1) {
        self.touchType = LTouchType.None
        return
      }
      const touch = touchList[0]
      const moveOffset = touch.clientX - self.touchStartX
      const moveTime = new Date().getTime() - self.touchStartTime
      const speed = moveOffset / moveTime
      // console.log(moveOffset, moveTime, speed);
      const gestureEndMinOffset = self.ele.clientWidth * 0.6
      const gestureEndMinSpeed = 0.4
      if (self.touchType === LTouchType.GestureBack && self.delegate) {
        self.delegate.touchBackFinish(moveOffset > gestureEndMinOffset || speed > gestureEndMinSpeed)
      }
      if (e.cancelable) {
        if (moveOffset > 1) {
          e.preventDefault()
        }
      }
      if (self.touchType === LTouchType.Single) {
        self.clickStateManager.deactive()
      }
      self.touchType = LTouchType.None
    }

    private static userTouchCancel (e: TouchEvent) {
      // console.log('userTouchCancel');
      const self = LTouch.__LTouch
      const touchList = e.changedTouches
      if (touchList.length !== 1) {
        self.touchType = LTouchType.None
        return
      }

      if (self.touchType === LTouchType.GestureBack) {
        if (self.delegate) {
          self.delegate.touchBackFinish(false)
        }
      }
      if (self.touchType === LTouchType.Single) {
        self.clickStateManager.deactive()
      }
      self.touchType = LTouchType.None
    }
}
