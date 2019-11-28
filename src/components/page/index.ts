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
    render(createElement): VNode {
        let {
            title, hiddenLeft
        } = this.$props;
        if(!(window.$LApp && window.$LApp.canPopPage())){
            hiddenLeft = true;
        }
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
