import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        is_auth: false,
        access_token: null,
        refresh_token: null,
        expires: null,
        user: null
    },
    mutations: {
        login(state, params) {
            state.is_auth = true;
            state.access_token = params.access_token;
            state.refresh_token = params.refresh_token;
            state.expires = params.expires;
        },
        refresh_token(state, params) {
            state.access_token = params.access_token;
            state.refresh_token = params.refresh_token;
            state.expires = params.expires;
        },
        set_user_data(state, data) {
            state.user = data;
        }
    },
    plugins: [createPersistedState({
        paths: ['is_auth', 'access_token', 'refresh_token', 'expires']
    })]
});