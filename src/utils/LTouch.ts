export default class LTouch {

    public static getInstance() {
        if (window.__LTouch) {
            return window.__LTouch
        } else {
            return new LTouch();
        }
    }

    constructor() {
        if (window.__LTouch) {
            throw new Error(this + " can be instanced only once! " +
                "You can use \"LTouch.getInstance()\" to get this had been created object");
        }
        window.__LTouch = this;
        document.addEventListener('touchstart', this.userTouchStart);
        document.addEventListener('touchmove', this.userTouchMove);
        document.addEventListener('touchend', this.userTouchEnd);
        document.addEventListener('touchcancel', this.userTouchCancle);
    }

    private userTouchStart(e:TouchEvent) {
        console.log('userTouchStart', e);
    }

    private userTouchMove() {
        console.log('userTouchMove');
    }

    private userTouchEnd() {
        console.log('userTouchEnd');
    }

    private userTouchCancle() {
        console.log('userTouchEnd');
    }
}
