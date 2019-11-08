import {createCssNamespace} from './NameSpace'

const ActiveNoneClassList = [
    'need-click'
].map((item) => createCssNamespace(item));
const ActiveTextClassList = [
    'nav-bar-left',
    'nav-bar-right',
].map((item) => createCssNamespace(item));
const ActiveBackgrounrClassList = [].map((item) => createCssNamespace(item));
const ActiveAllClassList = [
    'nav-button',
].map((item) => createCssNamespace(item));

const ActivableTagList = [
    'a',
    'button'
];

const DisableActiveClassList = [
    'not-show-active',
].map((item) => createCssNamespace(item));

export enum LElementActiveType {
    None,
    Text,
    Background,
    All
}

export class LElementStateManager {
    private readonly ele: Element;
    private readonly canActive:Boolean;
    private readonly activeType:LElementActiveType;
    private readonly activeClassName = '';

    constructor(touchEle: Element) {
        let {ele, canActive, activeType} = this.findActiveElement(touchEle);
        this.ele = ele;
        this.canActive = canActive;
        this.activeType = activeType;
        this.activeClassName = this.getActiveClassName();
    }
    private findActiveElement(ele: Element): {} {
        if (!ele) {
            return {
                ele: null,
                canActive: false,
                activeType: LElementActiveType.None
            };
        }
        let className = ele.className;
        if (!className) {
            return this.findActiveElement(ele.parentElement);
        }
        for (let idx = 0; idx < DisableActiveClassList.length; idx++) {
            let disableActiveClassName = DisableActiveClassList[idx];
            if (className.indexOf(disableActiveClassName) > -1) {
                return {
                    ele: ele,
                    canActive: false,
                    activeType: LElementActiveType.None
                };
            }
        }
        for (let idx = 0; idx < ActiveAllClassList.length; idx++) {
            let activeClassName = ActiveAllClassList[idx];
            if (className.indexOf(activeClassName) > -1) {
                return {
                    ele: ele,
                    canActive: true,
                    activeType: LElementActiveType.All
                };
            }
        }
        for (let idx = 0; idx < ActiveTextClassList.length; idx++) {
            let activeClassName = ActiveTextClassList[idx];
            if (className.indexOf(activeClassName) > -1) {
                return {
                    ele: ele,
                    canActive: true,
                    activeType: LElementActiveType.Text
                };
            }
        }
        for (let idx = 0; idx < ActiveBackgrounrClassList.length; idx++) {
            let activeClassName = ActiveBackgrounrClassList[idx];
            if (className.indexOf(activeClassName) > -1) {
                return {
                    ele: ele,
                    canActive: true,
                    activeType: LElementActiveType.Background
                };
            }
        }
        for (let idx = 0; idx < ActiveNoneClassList.length; idx++) {
            let activeClassName = ActiveNoneClassList[idx];
            if (className.indexOf(activeClassName) > -1) {
                return {
                    ele: ele,
                    canActive: true,
                    activeType: LElementActiveType.None
                };
            }
        }
        return this.findActiveElement(ele.parentElement);
    }
    private getActiveClassName():string{
        let activeClassName: string;
        switch (this.activeType) {
            case LElementActiveType.All:{
                activeClassName = createCssNamespace('active-state')
            }break;
            case LElementActiveType.Text:{
                activeClassName = createCssNamespace('active-state-text')
            }break;
            case LElementActiveType.Background:{
                activeClassName = createCssNamespace('active-state-background')
            }break;
            case LElementActiveType.None:{
                activeClassName = '';
            }break;
        }
        return activeClassName;
    }
    active(){
        if(!this.ele)return;
        if(!this.canActive)return;
        let className = this.ele.className;
        if(className){
            this.ele.className = `${className} ${this.activeClassName}`;
        }
    }
    deactive(){
        if(!this.ele)return;
        if(!this.canActive)return;
        let className = this.ele.className;
        if(className){
            this.ele.className = className.replace(` ${this.activeClassName}`, '');
        }
    }

}


