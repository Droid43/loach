// @ts-ignore
import Vue, { VNode } from 'vue'
import { createNamespace } from '../../utils/NameSpace'

export default Vue.component(createNamespace('nav-bar-title'), {
  data () {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {},
  mounted () {
    window.addEventListener('resize', this.fixTitlePosition)
  },
  destroyed () {
    window.removeEventListener('resize', this.fixTitlePosition)
  },
  methods: {
    fixTitlePosition () {
      this.$nextTick(() => {
        const ele = <HTMLElement> this.$el
        ele.style.setProperty('--loach-nav-bar-title-left', '0px')
        const left = (document.body.clientWidth - this.$el.clientWidth) / 2 - ele.offsetLeft
        ele.style.setProperty('--loach-nav-bar-title-left', left + 'px')
      })
    }
  },
  render (createElement): VNode {
    const {
      title
    } = this.$props
    this.fixTitlePosition()
    return createElement('span', {
      class: {
        'loach-nav-bar-title': true
      }
    }, [
      title
    ])
  }
})
