import Vue, { VNode } from 'vue'

export default Vue.component('l-button',{
    data () {
        return {
            msg: 'Hello Button'
        }
    },
    methods: {

    },
    computed: {
    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        return createElement('button', this.msg)
    }
});
