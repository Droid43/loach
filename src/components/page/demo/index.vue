<!--name-->
<template>
  <l-page title="Page Demo">
    <div v-for="item in 100" :key="item">
      hello
    </div>
  </l-page>
</template>

<style lang="less" scoped>
</style>

<script>
export default {
  props: {},
  data () {
    return {
      title: ''
    }
  },
  components: {},
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
