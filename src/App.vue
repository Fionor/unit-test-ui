<template>
  <div id="app">
    <nav v-if="$store.state.is_auth" class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <router-link class="navbar-brand col-sm-3 col-md-2 mr-0" :to="{name: 'main'}">unit-test</router-link>
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a @click="logout()" class="nav-link" href="#">Вийти</a>
        </li>
      </ul>
    </nav>
    <div v-if="$store.state.is_auth" class="container-fluid">
      <div class="row">
        <navigation/>
        <router-view v-if="$store.state.user"/>
      </div>
    </div>
    <router-view v-else/>
  </div>
</template>

<script>
  import 'bootstrap/dist/js/bootstrap.min'
  import Navigation from './components/Navigation'
  export default {
    name: 'App',
    components: {
      Navigation
    },
    methods: {
      get_token_info(){
        this.$oauth.token_info();
        console.log('get token info')
      },
      logout() {
        this.$oauth.logout();
      }
    },
    watch: {
      '$store.state.is_auth'(val) {
        if(val){
          this.get_token_info();
        }
      }
    },
    created(){
      if(this.$store.state.is_auth ) {
        this.get_token_info();
      }
    }
  }
</script>

<style>
@import url('bootstrap');
@import url('./assets/css/style.css');
@import url('./assets/css/dashboard.css');
@import url('./assets/css/font-awesome.min');
.cursor-pointer{
  cursor: pointer;
}
</style>
