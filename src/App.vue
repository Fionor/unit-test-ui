<template>
  <div>
    <div v-if="$store.state.user">
      <navigation/>
      <router-view />
    </div>
    <div v-else>
      <router-view />
    </div> 
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
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css');
@import url('./assets/css/font-awesome.min');
@import url('./assets/css/style.css');
.cursor-pointer{
  cursor: pointer;
}

</style>
