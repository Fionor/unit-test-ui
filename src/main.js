import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import store from './store/'
import Auth from './packages/auth/oauth'

window.$ = require('jquery');
window.jQuery = window.$;

Vue.use(VueAxios, axios);
Vue.use(Auth);

let is_refreshing = false;
let refresh_subscribers = [];



Vue.axios.interceptors.response.use(function (response) {
    
    if(response.data.status == 401 && store.state.is_auth) {
        const original_request = response.config;
        console.log('original_request', original_request);
        if(!is_refreshing) {
            is_refreshing = true;
            Vue.oauth.refresh_token()
            .then(newToken => {
                is_refreshing = false;
                onRrefreshed(newToken);
            });
        }
        const retryOrigReq = new Promise((resolve, reject) => {
            subscribeTokenRefresh(token => {
                original_request.params ? 
                    original_request.params = Object.assign(original_request.params, {access_token: token}) 
                    : original_request.params = {access_token: token};
                resolve(Vue.axios(original_request));
            });
        });
        return retryOrigReq;

    } else if (response.data.status == 402) {
        location.reload(true);
    } else {
        return response;
    }
}, function (error) {
    return Promise.reject(error);
});

Vue.axios.interceptors.request.use(function (config) {
        config.params ? 
            config.params = Object.assign(config.params, {access_token: store.state.access_token}) 
            : config.params = {access_token: store.state.access_token};
        return config;
    }, function (error) {
        return Promise.reject(error);
});

function subscribeTokenRefresh(cb) {
    refresh_subscribers.push(cb);
}
  
function onRrefreshed(token) {
    refresh_subscribers.map(cb => cb(token));
    refresh_subscribers = [];
}

Vue.axios.defaults.baseURL = 'http://185.86.77.96:3000';
Vue.prototype.$socket_url = 'http://185.86.77.96:3002';

Vue.config.productionTip = false

router.beforeEach(
  (to, from, next) => {
      if (to.matched.some(record => record.meta.for_guest)) {
          if (store.state.is_auth) {
              next({
                  path: '/'
              })
          } else next()
      }
      else if (to.matched.some(record => record.meta.for_auth)) {
          if (!store.state.is_auth) {
              next({
                  path: '/login'
              })
          } else if(store.state.user && !store.state.user.verified) next({path: '/main'}) 
          else next();
      }

      else next()
  }
);

window.vue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
