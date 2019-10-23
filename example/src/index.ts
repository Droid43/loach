import Vue from 'vue';
import Router from 'vue-router';
import App from './App';
import routes from './routes';
import home from './pages/Home'

Vue.use(Router);
routes.unshift({
    name: 'home',
    path: '/',
    component: home
});
const router = new Router({
    routes: routes
});
function initApp() {
    // new Vue({
    //     el: '#app',
    //     router: router,
    //     components: {App},
    //     template: '<App/>'
    // });
    new Vue({
        render: h => h(App),
        router
    }).$mount('#app')
}

initApp();
