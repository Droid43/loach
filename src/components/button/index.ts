import Vue, { VNode } from 'vue'

export default Vue.component('l-button', {
  props: {
    msg: {
      type: String,
      default: 'Hello Button'
    }
  },
  computed: {},
  render (createElement): VNode {
    return createElement('button', this.msg)
  },
  created () {
  },
  methods: {}
})
