<!--name-->
<template>
  <l-page title="NavBar Demo">
    <l-nav-bar class="demo-nav-bar"
               title="NavBar Demo"
               rightTitle="btn" />
  </l-page>
</template>

<style lang="less" scoped>
.demo-nav-bar {
  margin: 10px 0;
}
</style>

<script>
import LNavBar from '../index.ts'
export default {
  name: 'demo-nav-bar',
  props: {},
  data () {
    return {
      title: ''
    }
  },
  components: {
    LNavBar
  },
  computed: {},
  methods: {
    init () {
    }
  },
  mounted () {
    this.init()
  }
}

</script>
