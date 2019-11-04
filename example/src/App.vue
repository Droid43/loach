<template>
	<l-app id="app" :config="getAppConfig()"/>
</template>

<style lang="less">
	@import "../../src/components/index";
</style>
<script>
	import routes from './routes';
	export default {
		name    : 'App',
		data() {
			return {
			};
		},
		computed: {},
		watch   : {},
		created() {
			this.init();
		},
		methods : {
			getAppConfig(){
				return {
					routes:routes,
					currentPage: {
						name: '/',
						param: {}
					}
				}
			},
			init() {
			},
		},
		mounted() {
		},
	};
</script>
