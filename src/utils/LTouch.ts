import {LAppConfig} from "./LApp";

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
    public touchMoveX: Number;

    constructor(){
        LTouch.__LTouch = this;
    }

    bindElement(ele: Element) {
        if (this.ele) {
            this.ele.removeEventListener('touchstart');
            this.ele.removeEventListener('touchmove');
            this.ele.removeEventListener('touchend');
            this.ele.removeEventListener('touchcancel');
        }
        ele.addEventListener('touchstart', LTouch.userTouchStart, {passive: false});
        ele.addEventListener('touchmove', LTouch.userTouchMove, {passive: true});
        ele.addEventListener('touchend', LTouch.userTouchEnd);
        ele.addEventListener('touchcancel', LTouch.userTouchCancel);
        this.ele = ele;
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
        let gestureStartMaxOffset = 8;
        if (touch.clientX < gestureStartMaxOffset) {
            self.touchType = LTouchType.GestureBack;
            self.touchStartX = touch.clientX;
            if (self.delegate) {
                self.delegate.touchBackStart();
            }
            console.log('userTouchStart preventDefault');
            e.preventDefault();
            return;
        }
        self.touchType = LTouchType.Single;
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
        self.touchMoveX = moveOffset;
        // console.log(moveOffset);
        if (self.touchType === LTouchType.GestureBack && self.delegate) {
            self.delegate.touchBackMove(moveOffset);
        }
    }

    private static userTouchEnd(e: TouchEvent) {
        // console.log('userTouchEnd');
        let self = LTouch.__LTouch;
        let gestureEndMinOffset = 160;
        let moveOffset = self.touchMoveX;
        if (self.touchType === LTouchType.GestureBack && self.delegate) {
            self.delegate.touchBackFinish(moveOffset > gestureEndMinOffset);
        }
        self.touchType = LTouchType.None;
    }

    private static userTouchCancel(e: TouchEvent) {
        // console.log('userTouchCancel');
        let self = LTouch.__LTouch;

        if (self.touchType === LTouchType.GestureBack) {
            // console.log(moveOffset);
            if (self.delegate) {
                self.delegate.touchBackFinish(false);
            }
        }
        self.touchType = LTouchType.None;
    }
}
