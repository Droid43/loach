// @ts-ignore
import Vue, { VNode, CreateElement } from 'vue'
import { createNamespace } from '../../utils/NameSpace'
import { LApp } from '../../utils/LApp'

export default Vue.component(createNamespace('app'), {
  // functional: true,
  components: {},
  data () {
    return {
      pageList: <Array<VNode>>[]
    }
  },
  props: {
    config: {
      type: Object,
      default: null
    }
  },
  computed: {},
  render (createElement: CreateElement): VNode {
    const self = this
    const pageList = this.pageList
    const app = createElement('div', {
      class: ['loach-app', 'loach-app-transform']
    }, pageList)
    if (!LApp.getInstance().hasBind) {
      self.$nextTick(() => {
        LApp.getInstance().bindApp(app, createElement)
      })
    }
    return app
  },
  created () {
    new LApp(this.config)
  },
  methods: {
    display (itemList: Array<VNode>) {
      this.pageList.splice(0, this.pageList.length, ...itemList)
      this.$forceUpdate()
    }
  }
})
