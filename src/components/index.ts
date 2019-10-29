import { VueConstructor } from 'vue/types';
import button from './button'
import page from './page'

const components = {
	button,
	page,
};
const install = (Vue: VueConstructor) => {
  Object.keys(components).forEach(key => {
    Vue.component('l-' + key,components[key]);
  });
};
export default {
	button,
	page,
	install
};