import button from 'src/components/button/demo/index.vue'
import page from 'src/components/page/demo/index.vue'

let routers = [
	{
		name: "button",
		path: "/button",
		component: button,
	},	{
		name: "page",
		path: "/page",
		component: page,
	},
];

export default routers;