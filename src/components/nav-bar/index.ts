// @ts-ignore
import Vue, {VNode} from 'vue';
import {createNamespace} from '../../utils/NameSpace'
// import LNavBarLeft from '../nav-bar-left/index.ts'
// import LNavBarTitle from '../nav-bar-title/index.ts'
// import LNavBarRight from '../nav-bar-right/index.ts'

export default Vue.component( createNamespace('nav-bar') ,{
    // components:{
    //     LNavBarLeft,
    //     LNavBarTitle,
    //     LNavBarRight
    // },
    data () {
        return {
        }
    },
    props:{
        leftTitle: {
            type: String,
            default: '返回'
        },
        title: {
            type: String,
            default: ''
        },
        rightTitle: {
            type: String,
            default: ''
        }
    },
    computed: {
    },
    methods: {

    },
    // `createElement` 是可推导的，但是 `render` 需要返回值类型
    render (createElement): VNode {
        const {
            leftTitle, title, rightTitle
        } = this.$props;
        return createElement('div',{
            class:{
                'loach-nav-bar': true
            }
        },[
            createElement('l-nav-bar-left', {
                props:{
                    title: leftTitle
                }
            }),
            createElement('l-nav-bar-title', {
                props:{
                    title: title
                }
            }),
            createElement('l-nav-bar-right', {
                props:{
                    title: rightTitle
                }
            })
        ])
    }
})
