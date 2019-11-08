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
	export default {
		name:'demo-nav-bar',
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
			},
		},
		mounted() {
			this.init();
		},
	};

</script>
