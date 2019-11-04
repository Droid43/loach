// @ts-ignore
import Vue, {VNode} from 'vue';
import {createNamespace} from '../../utils/NameSpace'
import {LApp} from "../../utils/LApp";

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
    computed: {},
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render(createElement): VNode {
        let self = this;
        const {
            title
        } = this.$props;
        return createElement('div', {
            class: {
                'loach-nav-bar-left': true
            },
            on:{
                click:self.goBack
            }
        }, [
            createElement('div', {
                class: {
                    'loach-nav-bar-left-back-arrow': true
                }
            }),
            title
        ])
    },
    methods: {
        goBack(){
            LApp.getInstance().popPage(true, this.$el);
        }
    },
})
