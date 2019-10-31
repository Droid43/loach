// @ts-ignore
import Vue, {VNode} from 'vue';
import {createNamespace} from '../../utils/NameSpace'

export default Vue.component(createNamespace('nav-bar-left'), {
    data() {
        return {}
    },
    props:{
        title: {
            type: String,
            default: '返回'
        }
    },
    methods: {},
    computed: {},
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render(createElement): VNode {
        console.log(this);
        const {
            title
        } = this.$props;
        return createElement('div', {
            class: {
                'loach-nav-bar-left': true
            }
        }, [
            createElement('div', {
                class: {
                    'loach-nav-bar-left-back-arrow': true
                }
            }),
            title
        ])
    }
})
