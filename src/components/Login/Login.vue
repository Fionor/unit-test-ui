<template>
  <div class="loginmodal-container">
    <h1>Увійти</h1><br>
    <form @submit="e => e.preventDefault()">
      <input v-model="username" type="text" name="user" placeholder="Логін">
      <input v-model="password" type="password" name="pass" placeholder="Пароль">
      <input @click="login(username, password)" :disabled="!is_valid || data_fetching" type="submit" name="login" class="login loginmodal-submit" :value="data_fetching ? 'Завантаження...' : 'Увійти'">
    </form>
    <div class="login-help">
      <router-link tag="a" :to="{name: 'register'}">Реєстрація</router-link> - <a href="#">Відновити пароль</a>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        username: '',
        password: '',
        data_fetching: false
      }
    },
    methods: {
      login(username, password) {
        this.data_fetching = true;
        this.$oauth.login(username, password).then(response => {
          this.data_fetching = false;
          if(response.data.status == '401'){
            this.username = '';
            this.password = '';
          }
        })
      }
    },
    computed: {
      is_valid() {
        if(
          this.username.length < 4  || !this.username.match(/^\w+$/) 
          || this.password.length < 6 || !this.password.match(/^\w+$/)
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
