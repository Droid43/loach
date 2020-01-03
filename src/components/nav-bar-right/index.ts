// @ts-ignore
import Vue, { VNode } from 'vue'
import { createNamespace } from '../../utils/NameSpace'

export default Vue.component(createNamespace('nav-bar-right'), {
  data () {
    return {
    }
  },
  props: {
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
    } = this.$props
    return createElement('div', {
      class: {
        'loach-nav-bar-right': true
      }
    }, [
      title
    ])
  }
})
