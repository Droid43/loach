<!--name-->
<template>
	<l-page title="Button Demo">
		<l-button @click=""></l-button>
	</l-page>
</template>

<style lang="less" scoped>

</style>

<script>
	import LButton from '../index.ts'
	import {LApp, LAppRouteConfig, LAppRouteTransType} from '../../../utils/LApp';
	export default {
		name:'demo-button',
		props     : {},
		data() {
			return {
				title: '',
			};
		},
		components: {LButton},
		computed  : {},
		methods   : {
			init() {
			},
			click(){
				LApp.getInstance().pushPage({
					name: 'button',
				});
			}
		},
		mounted() {
			this.init();
		},
	};

</script>
