<!--name-->
<template>
	<div>
		<l-nav-bar class="demo-nav-bar" title="NavBar Demo" rightTitle="btn"></l-nav-bar>
	</div>
</template>

<style lang="less" scoped>
.demo-nav-bar{
	z-index: 1;
}
</style>

<script>
	import LNavBar from '../index.ts'
	import LTouch from '../../../utils/LTouch'
	export default {
		props     : {},
		data() {
			return {
				title: '',
			};
		},
		components: {
			LNavBar
		},
		computed  : {},
		methods   : {
			init() {
				LTouch.getInstance();
			},
		},
		mounted() {
			this.init();
		},
	};

</script>
