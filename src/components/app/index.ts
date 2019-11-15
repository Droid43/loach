// @ts-ignore
import Vue, {VNode, CreateElement} from 'vue';
import {createNamespace} from '../../utils/NameSpace'
import {LApp} from "../../utils/LApp";

export default Vue.component( createNamespace('app') ,{
    data () {
        return {
            pageList:[],
        }
    },
    props:{
        config: {
            type: Object,
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
    render (createElement: CreateElement): VNode {
        let app = createElement('div', {
            class:['loach-app', 'loach-app-transform']
        }, this.pageList);

        if(!LApp.getInstance().hasBind){
            this.$nextTick(() => {
                console.log('$nextTick');
                LApp.getInstance().bindApp(app, createElement);
            });
        }
        return app;
    },
    created(){
        new LApp(this.config);
    },
    methods: {
        display(pageList:Array<VNode>){
            // @ts-ignore
            this.pageList = pageList;
        }
    },
})
