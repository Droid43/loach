<!--name-->
<template>
	<l-page title="Home" :hidden-left="true">
		<h1>组件列表</h1>
		<div v-for="(item, index) in itemList"
		     :key="index"
		     class="item-force loach-need-click"
		     @click="clickItem(item)">
			<div @click.stop="clickItemContent(item)"
					class="item-force loach-need-click">
				{{item.name | upperFirstChat}}
			</div>
		</div>
	</l-page>
</template>

<style lang="less" scoped>
	.item-force {
		width   : 100%;
		padding : 5px 0;
	}

	/*.item-force:active {*/
	/*	background-color : red;*/
	/*}*/
</style>
<script>
	import {LApp, LAppRouteTransType} from '../../../src/utils/LApp';

	export default {
		name      : 'demo-home',
		props     : {},
		data() {
			return {
				itemList: [],
			};
		},
		filters   : {
			upperFirstChat(word) {
				return word[0].toUpperCase() + word.substr(1);
			},
		},
		components: {},
		computed  : {},
		methods   : {
			init() {
				this.itemList = LApp.getInstance().getRoutes().slice(1);
			},
			clickItem(item) {
				this.pushItem(item);
			},
			clickItemContent(item) {
				this.pushItem(item);
			},
			pushItem(item){
				console.log(item.name, this.itemList.indexOf(item) % 2 === 0);
				LApp.getInstance().pushPage({
					name: item.name,
					transType: this.itemList.indexOf(item) % 2 === 1 ? LAppRouteTransType.Line : LAppRouteTransType.Modal
				});
			}
		},
		mounted() {
			this.init();
		},
	};

</script>
