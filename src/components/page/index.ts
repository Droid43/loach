// @ts-ignore
import Vue, {VNode} from 'vue';

export default Vue.component( 'l-page' ,{
    data () {
        return {
            a:'',
            b:'',
            c:'',
        }
    },
    props:{
        title: {
            type: String,
            default: ''
        },
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
        return createElement('div',{
            class:{
                'loach-page': true
            }
        },[
            createElement('l-nav-bar', {
                props:{
                    title: title
                }
            }),
            createElement('l-page-container', {
            },this.$slots.default)
        ])
    }
})
