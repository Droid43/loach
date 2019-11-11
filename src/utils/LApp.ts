import {VNode, VueConstructor, CreateElement} from 'vue';
import {LTouch, LTouchBackEvent} from './LTouch'
import Tools from './Tools'
import {LPageTransitionManager} from './TransitionModule'
import Vue from 'vue'

interface Vue {
    $LApp: LApp;
    $LRoute: {};
    display(pageList: VNode[]): void;
}

type LAppRoute = {
    name: string;
    path: string;
    component: VueConstructor;
}

type LAppRouteConfig = {
    name: string;
    params: object;
}

export type LAppConfig = {
    routes: LAppRoute[];
    rootRoute: LAppRouteConfig
}

type LAppPageQueueItem = {
    name: string;
    path: string;
    tag: object;
    page: VNode;
}

enum LAppPageState {
    Prev,
    Current,
    Next
}

export class LApp implements LTouchBackEvent {
    private readonly config: LAppConfig;
    private routeMap: { [key: string]: LAppRoute };
    private readonly appTouch: LTouch;
    private readonly pageQueue: VNode[];
    private prevPage: VNode | undefined;
    private currentPage: VNode | undefined;
    private nextPage: VNode | undefined;
    private hasBind = false;
    private appNode: VNode;
    private createPage: CreateElement;

    // static method
    static getInstance() {
        if (window.$LApp) {
            return window.$LApp
        } else {
            throw Error("before use LApp.getInstance(), new LApp() need to be called");
        }
    }

    static getPageClass(state: LAppPageState) {
        let className: string;
        switch (state) {
            case LAppPageState.Prev: {
                className = 'loach-app-page-prev';
            }
                break;
            case LAppPageState.Current: {
                className = 'loach-app-page-current';
            }
                break;
            case LAppPageState.Next: {
                className = 'loach-app-page-next';
            }
                break;
        }
        return className;
    }

    static fixPageClass(page: VNode, state: LAppPageState) {
        let className = LApp.getPageClass(state);
        let ele = <Element><any>page.elm;
        if (ele) {
            ele.className = ele.className.replace(/[ ]*loach-app-page-[\w-]*/, '') + ' ' + className;
        }
    }

    constructor(config: LAppConfig) {
        if (!config) {
            throw new Error("new Lapp(config) need \"config\" to create");
        }
        let routes = config.routes;
        if (!(routes && routes.length > 0)) {
            throw new Error("Empty routes in config!");
        }
        if (window.$LApp) {
            throw new Error(this + " can be instanced only once! " +
                "You can use \"LApp.getInstance()\" to get this had been created object");
        }
        this.config = config;
        this.appTouch = new LTouch();
        this.appTouch.delegate = this;
        this.pageQueue = [];
        this.initRouteMap();
        console.log(window.navigator);
        window.$LApp = this;
    }

    // private method
    private initRouteMap() {
        let routeMap = {};
        this.config.routes.forEach((route: LAppRoute) => {
            if (routeMap[route.name]) {
                console.error('Duplicated route Name define')
            }
            routeMap[route.name] = route;
        });
        this.routeMap = routeMap;
    }

    private initRootPage() {
        let page = this.createPageWithConfig(this.config.rootRoute, LAppPageState.Current);
        if (page) {
            this.pageQueue.push(page);
            this.currentPage = page;
        }
    }

    private createPageWithConfig(routeConfig: LAppRouteConfig, state: LAppPageState) {
        let className = LApp.getPageClass(state);
        let {name, params} = routeConfig;
        if (!name) {
            console.error('no route name');
            return
        }
        let route = this.routeMap[name];
        if (!route) {
            console.error('not define route of ' + name);
            return;
        }
        let page = this.createPage(route.component, {
            class: [className]
        });
        let context = <Vue>page.context;
        context.$LApp = this;
        context.$LRoute = {
            name: name,
            params: params || {}
        };
        return page;
    }

    private updateDisPlayPage() {
        let pageList = [];
        if (this.prevPage) {
            LApp.fixPageClass(this.prevPage, LAppPageState.Prev);
            pageList.push(this.prevPage);
        }
        if (this.currentPage) {
            LApp.fixPageClass(this.currentPage, LAppPageState.Current);
            pageList.push(this.currentPage);
        }
        if (this.nextPage) {
            LApp.fixPageClass(this.nextPage, LAppPageState.Next);
            pageList.push(this.nextPage);
        }
        let context = <Vue>this.appNode.context;
        context.display(pageList);
    }

    private addPageAnimationClass() {
        LPageTransitionManager.addTransitionClassToPage(this.prevPage, this.currentPage, this.nextPage);
    }

    private removePageAnimationClass() {
        LPageTransitionManager.removeTransitionClassToPage(this.prevPage, this.currentPage, this.nextPage);
    }

    // public method
    bindApp(node: VNode, h: CreateElement) {
        if (this.hasBind) return;
        if (!node) {
            throw new Error("Bind ele must have a Vue VNode");
        }
        this.appNode = node;
        this.appTouch.bindElement(node.elm);
        this.createPage = h;
        this.hasBind = true;
        this.initRootPage();
        this.updateDisPlayPage();
    }

    getRoutes(): LAppRoute[] {
        return this.config && this.config.routes;
    }

    pushPage(routeConfig: LAppRouteConfig, animated = true) {
        let page = this.createPageWithConfig(routeConfig, LAppPageState.Next);
        if (!page) return;
        // this.pageQueue.push(page);
        // this.prevPage = this.currentPage;
        // this.currentPage = page;

        this.prevPage = undefined;
        this.nextPage = page;
        this.updateDisPlayPage();

        let self = this;
        let pagePushHander = () => {
            self.pageQueue.push(page);
            self.prevPage = this.currentPage;
            self.currentPage = page;
            self.nextPage = undefined;
            self.updateDisPlayPage();
        };
        let elm: HTMLElement = <any>(this.appNode.elm);
        self.removePageAnimationClass();
        elm.style.setProperty('--loach-app-transform-progress', '0');
        if (animated) {
            let context = <Vue>self.appNode.context;
            context.$nextTick(() => {
                let currentEle: HTMLElement = <any>(self.currentPage && self.currentPage.elm);
                self.addPageAnimationClass();
                LPageTransitionManager.animation(currentEle, () => {
                    context.$nextTick(() => {
                        elm.style.setProperty('--loach-app-transform-progress', '-1');
                    });
                }, () => {
                    self.removePageAnimationClass();
                    pagePushHander();
                    elm.style.setProperty('--loach-app-transform-progress', '0');
                });
            });
        } else {
            pagePushHander();
        }
    }

    popPage(animated = true) {
        // window.history.back();
        let self = this;
        let pageBackHander = () => {
            if (self.prevPage) {
                self.currentPage = self.prevPage
            }
            self.pageQueue.pop();
            self.prevPage = self.pageQueue.length > 1 ? self.pageQueue[self.pageQueue.length - 2] : null;
            // console.log('Back', self.appTouch);
            self.updateDisPlayPage();
        };
        let elm: HTMLElement = <any>(this.appNode.elm);
        let progress = elm.style.getPropertyValue('--loach-app-transform-progress');
        if (animated && progress !== '1') {
            let currentEle: HTMLElement = <any>(this.currentPage && this.currentPage.elm);
            this.addPageAnimationClass();
            let self = this;
            LPageTransitionManager.animation(currentEle, () => {
                elm.style.setProperty('--loach-app-transform-progress', '1');
            }, () => {
                self.removePageAnimationClass();
                pageBackHander();
                elm.style.setProperty('--loach-app-transform-progress', '0');
            });
        } else {
            pageBackHander();
            elm.style.setProperty('--loach-app-transform-progress', '0');
        }
    }

    isPageTranstion(){
        let elm: HTMLElement = <any>(this.appNode.elm);
        let progress = elm.style.getPropertyValue('--loach-app-transform-progress');
        let isPageTranstion = progress === '-1' || progress === '1';
        // console.log(progress, isPageTranstion ? '页面跳转中' : '跳转完成');
        return isPageTranstion;
    }
    // LTouch LTouchBackEvent delegate
    private touchBackStart() {
        // console.log('TouchBack Start');
        this.removePageAnimationClass();
    }

    private touchBackMove(moveOffset: Number) {
        // console.log('TouchBack Move', moveOffset);
        if (!this.prevPage) {
            return;
        }
        let elm: HTMLElement = <any>(this.appNode.elm);
        elm.style.setProperty('--loach-app-transform-progress', moveOffset / elm.clientWidth + '');
    }

    private touchBackFinish(canBack: Boolean) {
        // console.log('TouchBack End', canBack);
        // return;
        if (!this.prevPage) {
            return;
        }
        let elm: HTMLElement = <any>(this.appNode.elm);
        if (canBack) {
            this.popPage();
        } else {
            this.addPageAnimationClass();
            let self = this;
            let currentEle: HTMLElement = <any>(this.currentPage && this.currentPage.elm);

            LPageTransitionManager.animation(currentEle, () => {
                elm.style.setProperty('--loach-app-transform-progress', '0');
            }, () => {
                self.removePageAnimationClass();
            });
        }
        // elm.style.setProperty('--loach-app-transform-progress', 0);
    }
}
