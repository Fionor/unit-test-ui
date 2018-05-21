import store from '@/store';
import router from '@/router';
import axios from 'axios';

const oauth_url = 'http://localhost:3001'
const client_id = '5aad5632ca3438222413e105';
const client_secret = '$2a$05$GCJTceO5YZuruK1HC0Wwd.';

export default function (Vue) {

  Vue.oauth = {
    login(username, password) {
      const grant_type = 'password'
      return Vue.axios.post(`${oauth_url}/token`, {
        grant_type,
        client_id,
        client_secret,
        password,
        username
      }).then(response => {
        if(response.data.status == 401){
          alert('Не віринй логін/пароль')
        } else if(response.data.status == 200) {
        store.commit('login', {
          access_token: response.data.access_token,
          expires: response.data.expires,
          refresh_token: response.data.refresh_token
        });
          router.push('/')
        }
        return response
      })
    },
    logout() {
      return Vue.axios.get(`${oauth_url}/logout`).then(response => {
        if(response.data.status == 200) {
          localStorage.clear();
          location.reload(true);
        }
      })
    },
    register(user_data) {
      return Vue.axios.post(`${oauth_url}/user`, {
        username: user_data.username,
        password: user_data.password,
        role: user_data.role,
        group_id: user_data.group_id,
        v: 1,
        fio: user_data.fio
      }).then(response => {
        if(response.data.status == 200) {
          Vue.oauth.login(user_data.username, user_data.password);
        } else {
          alert('Логін зайнятий');
        }
      })
    },
    token_info() {
      Vue.axios.get(`${oauth_url}/token-info`, {
        params: {
          access_token: store.state.access_token
        }
      }).then(response => {
        if(response.data.status == 200){
          store.commit('set_user_data', response.data.response[0].user);
        }
      })
    },
    refresh_token(original_request) {
      const grant_type = 'refresh_token'
      const instanse = axios.create();
      return instanse.post(`${oauth_url}/token`, {
        grant_type,
        client_id,
        client_secret,
        refresh_token: store.state.refresh_token
      }).then(response => {
        if(response.data.status == 200) {
          store.commit('refresh_token', {
            access_token: response.data.access_token,
            expires: response.data.expires,
            refresh_token: response.data.refresh_token
          });
          return response.data.access_token;
        } else {
          localStorage.clear();
          location.reload(true);
        }
      });
    }
  };

  Object.defineProperties(Vue.prototype, {
    $oauth: {
      get() {
        return Vue.oauth
      }
    }
  })
}