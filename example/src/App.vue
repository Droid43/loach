<template>
	<div id="app">
		<keep-alive>
			<router-view/>
		</keep-alive>
	</div>
</template>

<script>

	export default {
		name    : 'App',
		data() {
			return {};
		},
		computed: {},
		watch   : {},
		created() {
			this.init();
		},
		methods : {
			init() {
			},
		},
		mounted() {
		},
	};
</script>

<style lang="less" scoped>
	#app {
		position   : absolute;
		top        : 0;
		left       : 0;
		width      : 100%;
		overflow-y : hidden;
	}
</style>
