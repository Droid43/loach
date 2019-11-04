// @ts-ignore
import Vue, {VNode} from 'vue';
import LTouch from '../../utils/LTouch'
import {createNamespace} from '../../utils/NameSpace'
import {LAppConfig, LApp} from "../../utils/LApp";

export default Vue.component( createNamespace('app') ,{
    data () {
        return {
            prevPage:null,
            currentPage:null,
            nextPage:null,
        }
    },
    props:{
        config: {
            type: LAppConfig,
            default: null
        },
        currentRoute: {
            type: String,
            default: '/'
        },
    },
    computed: {
    },
    model:{
        prop:'currentRoute',
        event: 'routeChange'
    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        // let routes = LApp.getInstance().getRoutes();
        this.prevPage = createElement('l-page',{
            class:['loach-app-page-prev']
        });
        this.currentPage = createElement('l-page',{
            class:['loach-app-page-current']
        });
        this.nextPage = createElement('l-page',{
            class:['loach-app-page-next']
        });
        let pageList = [];
        if(this.prevPage){
            pageList.push(this.prevPage)
        }
        if(this.currentPage){
            pageList.push(this.currentPage)
        }
        if(this.nextPage){
            // pageList.push(this.nextPage)
        }
        console.log(pageList);
        let node = createElement('div', {
            class:['loach-app', 'loach-app-transform']
        }, pageList);
        this.$nextTick(() => {
           LApp.getInstance().bindElement(node.elm);
        });
        return node;
    },
    created(){
        new LApp(this.config);
    },
    methods: {

    },
})
