import {VNode, VueConstructor, CreateElement} from 'vue';
import {LTouch, LTouchBackEvent} from './LTouch'
import Tools from './Tools'
import {LPageTransitionManager, LRouterHook} from './TransitionModule'

declare module 'vue/types/vue' {
    interface Vue {
        $LApp: LApp;
        $LRoute: LAppRouteConfig;

        display(pageList: VNode[]): void;
    }
}

declare global {
    interface Window {
        $LApp: LApp;
    }
}
// declare module 'vue' {
//     interface VNode {
//         transType: Boolean;
//     }
// }

type LAppRoute = {
    name: string;
    path: string;
    component: VueConstructor;
}

export enum LAppRouteTransType {
    Line,
    Modal,
}

export type LAppRouteConfig = {
    name: string;
    params?: object;
    transType?: LAppRouteTransType;
}

export type LAppConfig = {
    routes: LAppRoute[];
    rootRoute: LAppRouteConfig
}

// @ts-ignore
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
    private routeMap!: { [key: string]: LAppRoute };
    private readonly appTouch: LTouch;
    private readonly pageQueue: VNode[];
    private prevPage: VNode | undefined;
    private currentPage: VNode | undefined;
    private nextPage: VNode | undefined;
    private appNode!: VNode;
    private createPage!: CreateElement;
    hasBind = false;

    // static method
    static getInstance() {
        if (window.$LApp) {
            return window.$LApp
        } else {
            throw Error("before use LApp.getInstance(), new LApp() need to be called");
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
        this.pushPage(this.config.rootRoute, false);
    }

    private createPageWithConfig(routeConfig: LAppRouteConfig, state: LAppPageState) {
        let className = this.getPageClass(state);
        let {name, params, transType} = routeConfig;
        if (!name) {
            console.log(className);
            console.error('no route name');
            return
        }
        let route = this.routeMap[name];
        if (!route) {
            console.error('not define route of ' + name);
            return;
        }
        let page = this.createPage(route.component, {
            key: Tools.uniqueTag()
        });
        let context = page.context;
        if (context) {
            context.$LApp = this;
            context.$LRoute = {
                name: name,
                params: params || {},
                transType: transType,
            };
        }
        return page;
    }

    private updateDisPlayPage() {
        let pageList = [];
        if (this.prevPage) {
            this.fixPageClass(this.prevPage, LAppPageState.Prev);
            pageList.push(this.prevPage);
        }
        if (this.currentPage) {
            this.fixPageClass(this.currentPage, LAppPageState.Current);
            pageList.push(this.currentPage);
        }
        if (this.nextPage) {
            this.fixPageClass(this.nextPage, LAppPageState.Next);
            pageList.push(this.nextPage);
        }
        let context = this.appNode.context;
        if (context) {
            // context.display(this.nextPage ? this.pageQueue.concat(this.nextPage) : this.pageQueue);
            context.display(pageList);
        }
    }

    private addPageAnimationClass() {
        LPageTransitionManager.addTransitionClassToPage(this.prevPage, this.currentPage, this.nextPage);
    }

    private removePageAnimationClass() {
        LPageTransitionManager.removeTransitionClassToPage(this.prevPage, this.currentPage, this.nextPage);
    }

    private getPageClass(state: LAppPageState) {
        let transTag = '';
        if (this.nextPage) {
            let context = this.nextPage.context;
            if (context) {
                transTag = context.$LRoute.transType === LAppRouteTransType.Modal ? '-modal' : '';
            }
        } else if (this.currentPage) {
            let context = this.currentPage.context;
            if (context) {
                transTag = context.$LRoute.transType === LAppRouteTransType.Modal ? '-modal' : '';
            }
        }
        let className = '';
        switch (state) {
            case LAppPageState.Prev: {
                className = `loach-app-page${transTag}-prev`;
            }
                break;
            case LAppPageState.Current: {
                className = `loach-app-page${transTag}-current`;
            }
                break;
            case LAppPageState.Next: {
                className = `loach-app-page${transTag}-next`;
            }
                break;
        }
        return className;
    }

    private fixAllPageClass() {
        if (this.prevPage) {
            this.fixPageClass(this.prevPage, LAppPageState.Prev);
        }
        if (this.currentPage) {
            this.fixPageClass(this.currentPage, LAppPageState.Current);
        }
        if (this.nextPage) {
            this.fixPageClass(this.nextPage, LAppPageState.Next);
        }
    }

    private fixPageClass(page: VNode, state: LAppPageState) {
        let className = this.getPageClass(state);
        let ele = <Element><any>page.elm;
        if (ele) {
            ele.className = ele.className.replace(/[ ]*loach-app-page-[\w-]*/, '') + ' ' + className;
            ele.className = ele.className.replace(/loach-page[ ]+/g, '');
            ele.className = 'loach-page ' + ele.className;
            if(page.data){
                page.data.class = ele.className.split(" ");
            }
        }
    }

    // private preparePage(pageSetter:{():void} | undefined, readyCallback:{():void} | undefined){
    //     if(typeof pageSetter === 'function'){
    //         pageSetter();
    //     }
    //     let context = this.appNode.context;
    //     if (context) {
    //         context.$nextTick(() => {
    //             if(typeof readyCallback === 'function'){
    //                 readyCallback();
    //             }
    //         });
    //     }
    //
    // }
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

    getBindApp(){
        return this.appNode;
    }

    getRoutes(): LAppRoute[] {
        return this.config && this.config.routes;
    }

    canPopPage():boolean{
        return this.pageQueue.length > 1 || !!(this.nextPage);
    }

    getPageQueue(): VNode[] {
        return this.pageQueue.concat([]);
    }

    pushPages(...pageConfig:Array<LAppRouteConfig|boolean|(() => void)>){
        let animated = true;
        let completion: (() => void) | undefined;
        let pushList:Array<LAppRouteConfig> = [];
        pageConfig && pageConfig.forEach((config) => {
            if ( typeof config === 'object' ){
                pushList.push(config);
            }else if(typeof config === 'boolean'){
                animated = config;
            }else if(typeof config === 'function'){
                completion = config;
            }
        });
        let self = this;
        let context = this.appNode.context;
        let finishCallBack = () => {
            if(pushList.length === 0 || !context) return;
            context.$nextTick(() => {
                let config = <LAppRouteConfig>pushList.shift();
                self.pushPage(config,
                    pushList.length === 0 && animated,
                    pushList.length === 0 ? completion : finishCallBack);
            });
        };
        finishCallBack();
    }
    pushPage(routeConfig: LAppRouteConfig, animated = true, completion: (() => void) | undefined = undefined) {
        let page = this.createPageWithConfig(routeConfig, LAppPageState.Next);
        if (!page) return;
        if(page.data){
            page.data.keepAlive = true;
        }
        this.prevPage = undefined;
        this.nextPage = page;
        this.updateDisPlayPage();
        let self = this;
        let elm: HTMLElement = <any>(this.appNode.elm);
        let pagePushHander = () => {
            // @ts-ignore
            self.pageQueue.push(page);
            self.prevPage = self.currentPage;
            self.currentPage = page;
            self.nextPage = undefined;
            LRouterHook.deactivePage(self.prevPage && self.prevPage.componentInstance);
            elm.style.setProperty('--loach-app-transform-direct', '-0.5');
            self.updateDisPlayPage();
            if(typeof completion === 'function'){
                completion();
            }
        };
        self.removePageAnimationClass();
        elm.style.setProperty('--loach-app-transform-direct', '0.5');
        elm.style.setProperty('--loach-app-transform-progress', '0');
        if (animated) {
            let context = self.appNode.context;
            if (context) {
                context.$nextTick(() => {
                    let transEle: HTMLElement = <any>(self.nextPage && self.nextPage.elm);
                    self.fixAllPageClass();
                    // @ts-ignore
                    context.$nextTick(() => {
                        self.addPageAnimationClass();
                        LPageTransitionManager.animation(transEle, () => {
                            elm.style.setProperty('--loach-app-transform-progress', '-1');
                        }, () => {
                            self.removePageAnimationClass();
                            pagePushHander();
                            elm.style.setProperty('--loach-app-transform-progress', '0');
                        });
                    });
                });
            }
        } else {
            pagePushHander();
        }
    }

    popPages(...args:Array<number|boolean|(() => void)>){
        let self = this;
        let animated = true;
        let completion: (() => void) | undefined;
        let popCount = 0;
        args && args.forEach((config) => {
            console.log(typeof config);
            if ( typeof config === 'number' ){
                popCount = Math.min(config, self.pageQueue.length - 1);
            }else if(typeof config === 'boolean'){
                animated = config;
            }else if(typeof config === 'function'){
                completion = config;
            }
        });
        let context = self.appNode.context;
        let finishCallBack = () => {
            if(popCount === 0 || !context) return;
            popCount--;
            context.$nextTick(() => {
                self.popPage(popCount === 0 && animated,
                    popCount === 0 ? completion : finishCallBack);
            });
        };
        finishCallBack();
    }

    popPage(animated = true, completion: (() => void) | undefined = undefined) {
        // window.history.back();
        if(!this.canPopPage()){
            return
        }
        let self = this;
        let elm: HTMLElement = <any>(this.appNode.elm);
        let pageBackHandler = () => {
            if (self.prevPage) {
                self.currentPage = self.prevPage
            }
            let page = self.pageQueue.pop();
            if(page && page.data){
                page.data.keepAlive = false;
                if(page.componentInstance){
                    page.componentInstance.$destroy();
                }
            }
            LRouterHook.activePage(self.currentPage && self.currentPage.componentInstance);
            self.prevPage = self.pageQueue.length > 1 ? self.pageQueue[self.pageQueue.length - 2] : undefined;
            LRouterHook.fixOldPagePatch(self.appNode, self.prevPage);
            self.updateDisPlayPage();
            elm.style.setProperty('--loach-app-transform-progress', '0');
            let context = self.appNode.context;
            if (context) {
                context.$nextTick(() => {
                    self.removePageAnimationClass();
                    self.fixAllPageClass();
                    if(typeof completion === 'function'){
                        completion();
                    }
                });
            }
        };
        LRouterHook.deactivePage(self.currentPage && self.currentPage.componentInstance);
        self.removePageAnimationClass();
        elm.style.setProperty('--loach-app-transform-direct', '-0.5');
        let progress = elm.style.getPropertyValue('--loach-app-transform-progress');
        if (animated && progress !== '1') {
            let context = self.appNode.context;
            if (context) {
                context.$nextTick(() => {
                    let transEle: HTMLElement = <any>(this.currentPage && this.currentPage.elm);
                    self.fixAllPageClass();
                    // @ts-ignore
                    context.$nextTick(() => {
                        self.addPageAnimationClass();
                        LPageTransitionManager.animation(transEle, () => {
                            elm.style.setProperty('--loach-app-transform-progress', '1');
                        }, () => {
                            self.removePageAnimationClass();
                            pageBackHandler();
                        });
                    });
                });
            }
        } else {
            pageBackHandler();
        }
    }

    isPageTransition() {
        let elm: HTMLElement = <any>(this.appNode.elm);
        let progress = elm.style.getPropertyValue('--loach-app-transform-progress');
        // console.log(progress, (progress === '-1' || progress === '1') ? 'page in transition' : 'transition finished');
        return progress === '-1' || progress === '1';
    }

    // LTouch LTouchBackEvent delegate
    // @ts-ignore
    touchBackStart() {
        // console.log('TouchBack Start');
        this.removePageAnimationClass();
    }

    touchBackMove(moveOffset: number) {
        // console.log('TouchBack Move', moveOffset);
        if (!this.prevPage) {
            return;
        }
        let elm: HTMLElement = <any>(this.appNode.elm);
        elm.style.setProperty('--loach-app-transform-progress', moveOffset / elm.clientWidth + '');
    }

    touchBackFinish(canBack: Boolean) {
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
    }
}
