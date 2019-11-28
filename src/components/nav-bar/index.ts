// @ts-ignore
import Vue, {VNode} from 'vue';
import {createNamespace} from '../../utils/NameSpace'
// import LNavBarLeft from '../nav-bar-left/index.js'
// import LNavBarTitle from '../nav-bar-title/index.js'
// import LNavBarRight from '../nav-bar-right/index.js'

export default Vue.component(createNamespace('nav-bar'), {
    // components:{
    //     LNavBarLeft,
    //     LNavBarTitle,
    //     LNavBarRight
    // },
    data() {
        return {}
    },
    props: {
        leftTitle: {
            type: String,
            default: '返回'
        },
        hiddenLeft: {
            type: Boolean,
            default: false
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
    computed: {},
    methods: {},
    render(createElement): VNode {
        const {
            leftTitle, hiddenLeft, title, rightTitle
        } = this.$props;
        let itemList = [];
        if (!hiddenLeft) {
            itemList.push(createElement('l-nav-bar-left', {
                props: {
                    title: leftTitle
                }
            }));
        }
        itemList.push(
            createElement('l-nav-bar-title', {
                props: {
                    title: title
                }
            })
        );
        itemList.push(
            createElement('l-nav-bar-right', {
                props: {
                    title: rightTitle
                }
            })
        );
        return createElement('div', {
            class: {
                'loach-nav-bar': true
            }
        }, itemList)
    }
})
