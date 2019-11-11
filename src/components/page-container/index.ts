// @ts-ignore
import Vue, {VNode} from 'vue';

export default Vue.component( 'l-page-container' ,{
    data () {
        return {
        }
    },
    props:{
        hasNavBar: {
            type: Boolean,
            default: true
        },
    },
    methods: {

    },
    computed: {
    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        const {
            hasNavBar
        } = this.$props;
        let classList = ['loach-page-container'];
        if(!hasNavBar) classList.push('loach-page-container-without-nav-bar');
        return createElement('div', {
            class: classList
        }, [this.$slots.default])
    }
})
