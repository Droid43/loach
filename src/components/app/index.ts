// @ts-ignore
import Vue, {VNode} from 'vue';
import LTouch from '../../utils/LTouch'
import {createNamespace} from '../../utils/NameSpace'

export default Vue.component( createNamespace('app') ,{
    data () {
        return {
            msg: 'Hello page'
        }
    },
    computed: {
    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        return createElement('div', this.msg)
    },
    created(){
        LTouch.getInstance();
    },
    methods: {

    },
})
