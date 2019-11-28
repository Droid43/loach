import {VueConstructor} from "vue";
import {LApp, LAppRouteConfig} from "./LApp";

declare module 'vue/types/vue' {
    interface Vue {
        $LApp: LApp;
        $LRoute: LAppRouteConfig;
    }
}
export const setup =  (Vue: VueConstructor) => {
    Vue.mixin({
        beforeCreate: function beforeCreate () {
            if (this.$parent && this.$parent.$LRoute) {
                this.$LRoute = this.$parent.$LRoute;
            }
            if (this.$parent && this.$parent.$LApp) {
                this.$LApp = this.$parent.$LApp;
            }
        }
    });
};
