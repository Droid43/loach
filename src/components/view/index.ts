// @ts-ignore
import Vue, {VNode} from 'vue';

export default Vue.component( 'l-view' ,{
    data () {
        return {
            msg: 'Hello page'
        }
    },
    methods: {

    },
    computed: {
    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        return createElement('h1', this.msg)
    }
})
