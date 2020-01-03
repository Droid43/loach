<!--name-->
<template>
  <l-page title="Button Demo">
    <h2>{{classTag}}</h2>
    <l-button class="loach-need-click"
              @click.native="clickBtn" />
    <l-button class="loach-need-click"
              @click.native="showSelf"
              :msg="'Show Self ' + (msg + 1)" />
    <div class="item-wrapper"
         v-for="(item, idx) in routeList"
         :key="idx">
      <p v-if="idx <= msg+1">
        {{item.key}}
        <br>
        index: {{idx}}
      </p>
    </div>
  </l-page>
</template>

<style lang="less" scoped>
.item-wrapper {
  padding: 5px 0;
}
</style>

<script>
import LButton from '../index.ts'
import { LAppRouteTransType } from '../../../../src/utils/LApp'

const onceCount = 4
export default {
  name: 'demo-button',
  props: {},
  data () {
    return {
      msg: 0,
      classTag: '',
      routeList: []
    }
  },
  components: { LButton },
  computed: {},
  methods: {
    init () {
      this.classTag = this.$vnode.data.key
      this.msg = this.$LRoute.params.msg || 0
      this.routeList = this.$LApp.getPageQueue()
      console.log(this.routeList)
    },
    clickBtn () {
      const count = onceCount// this.msg % 3 + 1;
      const pageList = []
      for (let idx = 0; idx < count; idx++) {
        pageList.push({
          name: 'button',
          params: {
            msg: this.msg + idx + 1
          },
          transType: LAppRouteTransType.Line
        })
      }
      this.$LApp.pushPages(...pageList)
      // this.$LApp.pushPage({
      // name     : 'button',
      // params   : {
      // msg: this.msg + 1,
      // },
      // transType: LAppRouteTransType.Line,
      // });
    },
    showSelf () {
      console.log(this)
      this.$LApp.popPages(onceCount)
    }
  },
  // created() {
  // console.log('[debug] created:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
  // },
  mounted () {
    console.log('[debug] mounted:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params)
    this.init()
  }
  // deactivated() {
  // console.log('[debug] deactivated:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
  // },
  // activated() {
  // console.log('[debug] activated:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
  // },
  // destroyed() {
  // console.log('[debug] destroyed:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
  // },
}

</script>
