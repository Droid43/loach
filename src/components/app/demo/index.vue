<!--name-->
<template>
	<l-page title="App Demo">
		<div>app</div>
	</l-page>
</template>

<style lang="less" scoped>

</style>

<script>
	export default {
		name:'demo-app',
		props     : {},
		data() {
			return {
				title: '',
			};
		},
		components: {},
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
