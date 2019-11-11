// @ts-ignore
import Vue, {VNode} from 'vue';
import {createNamespace} from '../../utils/NameSpace'

export default Vue.component( createNamespace('nav-bar-title') ,{
    data () {
        return {
        }
    },
    props:{
        title: {
            type: String,
            default: ''
        }
    },
    methods: {

    },
    computed: {
    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        const {
            title
        } = this.$props;
        this.$nextTick(() => {
            // console.log(this.$el);
            let left = (document.body.clientWidth - this.$el.clientWidth) / 2 - this.$el.offsetLeft;
            this.$el.style.setProperty('--loach-nav-bar-title-left', left + 'px');
        });
        return createElement('span', {
            class: {
                'loach-nav-bar-title': true
            }
        },[
            title
        ])
    }
})
