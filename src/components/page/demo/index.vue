<!--name-->
<template>
	<div>
		<l-page title="Page Demo">
			<div v-for="item in 100">
				hello
			</div>
		</l-page>
	</div>
</template>

<style lang="less" scoped>

</style>

<script>
	export default {
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
