import { VueConstructor } from 'vue/types';
import {LTouch, LTouchBackEvent} from './LTouch'

type LAppRoute = {
    name:string;
    path:string;
    component:VueConstructor;
}

type LAppRouteConfig = {
    name:string;
    params:object;
}
export type LAppConfig = {
    routes:LAppRoute[];
    launchRoute:LAppRouteConfig
}

export class LApp implements LTouchBackEvent{
    private readonly config:LAppConfig;
    private readonly appTouch:LTouch;
    private appEle: Element;
    public static getInstance() {
        if (window.$LApp) {
            return window.$LApp
        }else {
            throw Error("before use LApp.getInstance(), new LApp() need to be called");
        }
    }
    constructor(config: LAppConfig){
        if(!config){
            throw new Error("new Lapp(config) need \"config\" to create");
        }
        let routes = config.routes;
        if(!(routes && routes.length > 0)){
            throw new Error("Empty routes in config!");
        }
        if (window.$LApp) {
            throw new Error(this + " can be instanced only once! " +
                "You can use \"LApp.getInstance()\" to get this had been created object");
        }
        this.config = config;
        this.appTouch = new LTouch();
        this.appTouch.delegate = this;
        window.$LApp = this;
    }
    bindElement(ele: Element){
        if(!(ele instanceof Element)){
            throw new Error("Bind ele must be a html element");
        }
        this.appEle = ele;
        this.appTouch.bindElement(ele);
    }
    public getRoutes(): LAppRoute[] {
        return this.config && this.config.routes;
    }
    public popPage(animated=true, touchEle){
        window.history.back();
        console.log('Back', touchEle, this.appTouch);
    }


    // LTouch LTouchBackEvent delegate
    private touchBackStart() {
        console.log('TouchBack Start');
    }
    private touchBackMove(moveOffset: Number) {
        console.log('TouchBack Move', moveOffset);
        this.appEle.style.setProperty('--loach-app-transform-offset', moveOffset+'px');
    }
    private touchBackFinish(canBack: Boolean) {
        console.log('TouchBack End', canBack);
        this.appEle.style.removeProperty('--loach-app-transform-offset');
        if(canBack){
            window.history.back();
        }
    }
}
