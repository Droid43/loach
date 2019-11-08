// @ts-ignore
import Vue, {VNode} from 'vue';

export default Vue.component('l-page', {
    data() {
        return {
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        hiddenLeft: {
            type: Boolean,
            default: false
        },
    },
    methods: {},
    computed: {},
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render(createElement): VNode {
        const {
            title, hiddenLeft
        } = this.$props;
        return createElement('div', {
            class: {
                'loach-page': true,
            }
        }, [
            createElement('l-nav-bar', {
                props: {
                    title: title,
                    hiddenLeft: hiddenLeft
                }
            }),
            createElement('l-page-container', {}, this.$slots.default)
        ])
    }
})
