import {LAppConfig} from "./LApp";
import {LElementStateManager} from './TransitionModule'

enum LTouchType {
    None,
    Single,
    Multiple,
    GestureBack
}

export interface LTouchBackEvent {
    touchBackStart();

    touchBackMove(moveOffset: Number);

    touchBackFinish(canBack: Boolean);
}

export class LTouch {
    private static __LTouch: LTouch;
    private touchType = LTouchType.None;
    private ele: Element;
    public delegate: LTouchBackEvent;
    public touchStartX: Number;
    private clickStateManager: LElementStateManager;

    constructor(){
        LTouch.__LTouch = this;
    }

    bindElement(ele: Element | any) {
        if (this.ele) {
            this.ele.removeEventListener('touchstart', LTouch.userTouchStart);
            this.ele.removeEventListener('touchmove', LTouch.userTouchMove);
            this.ele.removeEventListener('touchend', LTouch.userTouchEnd);
            this.ele.removeEventListener('touchcancel', LTouch.userTouchCancel);
        }
        ele.addEventListener('touchstart', LTouch.userTouchStart, false);
        ele.addEventListener('touchmove', LTouch.userTouchMove);
        ele.addEventListener('touchend', LTouch.userTouchEnd);
        ele.addEventListener('touchcancel', LTouch.userTouchCancel);
        this.ele = ele;
    }

    private static elementTypeList(e: Element) {
        let nodeType = [e.className];
        if(e.parentElement){
            return nodeType.concat(LTouch.elementTypeList(e.parentElement));
        }
        return nodeType;
    }

    private static getCanClickElement(e: Element) {
        let canClick = e.className.indexOf('loach-need-click') > -1;
        if(canClick) return e;
        if(e.parentElement){
            return LTouch.getCanClickElement(e.parentElement);
        }
    }


    private static userTouchStart(e: TouchEvent) {
        let self = LTouch.__LTouch;
        let touchList = e.touches;
        if (touchList.length !== 1) {
            self.touchType = LTouchType.Multiple;
            return;
        }
        // console.log('userTouchStart', e.target);
        // console.log('userTouchStart', e.target.__vue__);
        // console.log('userTouchStart', e);
        let touch = touchList[0];
        // console.log('userTouchStart', touch.clientX, touch.clientY);
        self.touchStartX = touch.clientX;
        let gestureStartMaxOffset = 8;
        if (touch.clientX < gestureStartMaxOffset) {
            self.touchType = LTouchType.GestureBack;
            if (self.delegate) {
                self.delegate.touchBackStart();
            }
            console.log('userTouchStart preventDefault');
            e.preventDefault();
            return;
        }
        self.touchType = LTouchType.Single;
        self.clickStateManager = new LElementStateManager(<Element><any>(e.target));
        self.clickStateManager.active();
        // LTouch.singleTouchStart(e);
    }

    private static userTouchMove(e: TouchEvent) {
        // console.log('userTouchMove');
        let self = LTouch.__LTouch;
        // console.log('touchList',e);
        let touchList = e.touches;
        if (touchList.length !== 1) {
            return;
        }
        let touch = touchList[0];
        let moveOffset = touch.clientX - self.touchStartX;
        let maxOffset = self.ele.clientWidth/0.9;
        moveOffset = moveOffset < 0 ? 0 : moveOffset;
        moveOffset = moveOffset >  maxOffset ? maxOffset : moveOffset;
        // console.log(moveOffset);
        if (self.touchType === LTouchType.GestureBack && self.delegate) {
            self.delegate.touchBackMove(moveOffset);
        }
        if(self.touchType === LTouchType.Single && moveOffset > 5){
            self.clickStateManager.deactive();
        }
    }

    private static userTouchEnd(e: TouchEvent) {
        // console.log('userTouchEnd');
        let self = LTouch.__LTouch;
        let touchList = e.changedTouches;
        if (touchList.length !== 1) {
            self.touchType = LTouchType.None;
            return;
        }
        let touch = touchList[0];
        let moveOffset = touch.clientX - self.touchStartX;
        let gestureEndMinOffset = self.ele.clientWidth * 0.6;
        if (self.touchType === LTouchType.GestureBack && self.delegate) {
            self.delegate.touchBackFinish(moveOffset > gestureEndMinOffset);
        }
        if(e.cancelable){
            if(moveOffset > 1){
                e.preventDefault();
            }
        }
        if(self.touchType === LTouchType.Single){
            self.clickStateManager.deactive();
        }
        self.touchType = LTouchType.None;
    }

    private static userTouchCancel(e: TouchEvent) {
        // console.log('userTouchCancel');
        let self = LTouch.__LTouch;
        let touchList = e.changedTouches;
        if (touchList.length !== 1) {
            self.touchType = LTouchType.None;
            return;
        }

        if (self.touchType === LTouchType.GestureBack) {
            if (self.delegate) {
                self.delegate.touchBackFinish(false);
            }
        }
        if(self.touchType === LTouchType.Single){
            self.clickStateManager.deactive();
        }
        self.touchType = LTouchType.None;
    }
}
