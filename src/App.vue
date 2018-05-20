<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import 'bootstrap/dist/js/bootstrap.min'
  export default {
    name: 'App',
    methods: {
      get_token_info(){
        this.$oauth.token_info();
        console.log('get token info')
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
</style>
