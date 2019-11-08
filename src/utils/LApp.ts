import {VNode, VueConstructor, CreateElement} from 'vue';
import {LTouch, LTouchBackEvent} from './LTouch'
import Tools from './Tools'

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
    private prevPage: VNode;
    private currentPage: VNode;
    private nextPage: VNode;
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
    static getPageClass(state:LAppPageState){
        let className: string;
        switch (state) {
            case LAppPageState.Prev:{
                className = 'loach-app-page-prev';
            }break;
            case LAppPageState.Current:{
                className = 'loach-app-page-current';
            }break;
            case LAppPageState.Next:{
                className = 'loach-app-page-next';
            }break;
        }
        return className;
    }

    static fixPageClass(page:VNode, state:LAppPageState){
        let className = LApp.getPageClass(state);
        if(page.elm){
            page.elm.className = page.elm.className.replace(/[ ]*loach-app-page-[\w-]*/, '') + ' ' + className;
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
    initRouteMap() {
        let routeMap = {};
        this.config.routes.forEach((route: LAppRoute) => {
            if (routeMap[route.name]) {
                console.error('Duplicated route Name define')
            }
            routeMap[route.name] = route;
        });
        this.routeMap = routeMap;
    }

    initRootPage() {
        let page = this.createPageWithConfig(this.config.rootRoute, LAppPageState.Current);
        if (page) {
            this.pageQueue.push(page);
            this.currentPage = page;
        }
    }

    createPageWithConfig(routeConfig: LAppRouteConfig,state:LAppPageState ) {
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
        page.context.$LApp = this;
        page.context.$LRoute = {
            name: name,
            params: params || {}
        };
        return page;
    }

    updateDisPlayPage() {
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
        this.appNode.context.display(pageList);
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
        let page = this.createPageWithConfig(routeConfig, LAppPageState.Current);
        if (!page) return;
        this.pageQueue.push(page);
        this.prevPage = this.currentPage;
        this.currentPage = page;
        console.log('Push');
        this.updateDisPlayPage();
    }

    popPage(animated = true) {
        // window.history.back();
        if (this.prevPage) {
            this.currentPage = this.prevPage
        }
        this.pageQueue.pop();
        this.prevPage = this.pageQueue.length > 1 ? this.pageQueue[this.pageQueue.length - 2] : null;
        console.log('Back', this.appTouch);
        this.updateDisPlayPage();
    }

    // LTouch LTouchBackEvent delegate
    private touchBackStart() {
        // console.log('TouchBack Start');
    }

    private touchBackMove(moveOffset: Number) {
        // console.log('TouchBack Move', moveOffset);
        if (!this.prevPage) {
            return;
        }
        this.appNode.elm.style.setProperty('--loach-app-transform-offset', moveOffset + 'px');
    }

    private touchBackFinish(canBack: Boolean) {
        // console.log('TouchBack End', canBack);
        if (!this.prevPage) {
            return;
        }
        this.appNode.elm.style.removeProperty('--loach-app-transform-offset');
        if (canBack) {
            this.popPage();
        }
    }
}
