<!--name-->
<template>
	<div>
		<h1>组件列表</h1>
		<div v-for="(item, index) in itemList" :key="index">
			<router-link :to="item.path" >{{item.name | upperFirstChat}}</router-link>
		</div>
	</div>
</template>

<style lang="less" scoped>

</style>

<script>

	export default {
		props     : {},
		data() {
			return {
				itemList: '',
			};
		},
		filters: {
			upperFirstChat(word){
				return word[0].toUpperCase() + word.substr(1);
			}
		},
		components: {},
		computed  : {},
		methods   : {
			init() {
				this.itemList = this.$router.options.routes.slice(1);
			},
		},
		mounted() {
			this.init();
		},
	};

</script>
