<!--name-->
<template>
	<l-page title="Button Demo">
		<div class="item-wrapper" v-for="idx in msg">
			<p>
				{{classTag}}
				<br>
				index: {{idx}}
			</p>
		</div>
		<l-button class="loach-need-click" @click.native="clickBtn"/>
		<l-button class="loach-need-click" @click.native="showSelf" msg="Show Self"/>
	</l-page>
</template>

<style lang="less" scoped>
	.item-wrapper {
		padding: 100px 0;
	}
</style>

<script>
	import LButton from '../index.ts';
	import {LAppRouteTransType} from '../../../../lib/utils/LApp';

	export default {
		name      : 'demo-button',
		props     : {},
		data() {
			return {
				msg     : 0,
				classTag: '',
			};
		},
		components: {LButton},
		computed  : {},
		methods   : {
			init() {
				this.classTag = this.$vnode.data.key;
				this.msg      = this.$LRoute.params.msg || 0;
			},
			clickBtn() {
				this.$LApp.pushPage({
					name     : 'button',
					params   : {
						msg: this.msg + 1,
					},
					transType: LAppRouteTransType.Line,
				});
			},
			showSelf() {
				console.log(this);
			},
		},
		created() {
			console.log('[debug] created:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
		},
		mounted() {
			console.log('[debug] mounted:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
			this.init();
		},
		deactivated() {
			console.log('[debug] deactivated:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
		},
		activated() {
			console.log('[debug] activated:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
		},
		destroyed() {
			console.log('[debug] destroyed:', this.$vnode.data.key, this.$LRoute && this.$LRoute.params);
		},
	};

</script>
