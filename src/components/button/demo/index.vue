<!--name-->
<template>
	<l-page title="Button Demo">
		<l-button></l-button>
	</l-page>
</template>

<style lang="less" scoped>

</style>

<script>
	import LButton from '../index.ts'
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
		},
		mounted() {
			this.init();
		},
	};

</script>
