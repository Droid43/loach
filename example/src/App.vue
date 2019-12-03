<template>
  <l-app id="app"
         :config="getAppConfig()" />
</template>

<style lang="less">
@import "../../src/components/index";
</style>
<script>
import routes from './routes'
import home from './pages/Home'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  computed: {},
  watch: {},
  created () {
    this.init()
  },
  methods: {
    getAppConfig () {
      routes.unshift({
        name: 'home',
        path: '/',
        component: home
      })
      return {
        routes: routes,
        rootRoute: {
          name: 'home',
          param: {}
        }
      }
    },
    init () {
    }
  },
  mounted () {
  }
}
</script>
