<template>
  <div v-if="recovery_status == null" class="loginmodal-container">
    <h1>Відновлення</h1><br>
    <form @submit="e => e.preventDefault()">
      <input v-model="username" type="text" name="user" placeholder="Логін">
      <input :disabled="recovery_status_fetching" @click="get_recovery_status()" type="submit" name="login" class="login loginmodal-submit" :value="'Перевірити'">
    </form>
    <div class="login-help">
      <router-link tag="a" :to="{name: 'register'}">Реєстрація</router-link> - <router-link tag="a" :to="{name: 'login'}">Увійти</router-link>
    </div>
  </div>
  <div v-else-if="recovery_status == 0" class="loginmodal-container">
    <h1>Відновлення</h1><br>
    <form @submit="e => e.preventDefault()">
      <input v-model="username" disabled type="text" name="user" placeholder="Логін">
      <input @click="recovery_password(1)" type="submit" name="login" class="login loginmodal-submit" :value="'Відновити'">
    </form>
    <div class="login-help">
      <router-link tag="a" :to="{name: 'register'}">Реєстрація</router-link> - <router-link tag="a" :to="{name: 'login'}">Увійти</router-link>
    </div>
  </div>
  <div v-else-if="recovery_status == 1" class="loginmodal-container">
    <h1>Відновлення</h1><br>
    <form @submit="e => e.preventDefault()">
      <h1>Відбувається перевірка данних</h1>
    </form>
    <div class="login-help">
      <router-link tag="a" :to="{name: 'register'}">Реєстрація</router-link> - <router-link tag="a" :to="{name: 'login'}">Увійти</router-link>
    </div>
  </div>
  <div v-else-if="recovery_status == 2" class="loginmodal-container">
    <h1>Відновлення</h1><br>
    <form @submit="e => e.preventDefault()">
      <input v-model="username" disabled type="text" name="user" placeholder="Логін">
      <input v-model="password" type="password" name="user" placeholder="Пароль">
      <input @click="recovery_password(2)" type="submit" name="login" class="login loginmodal-submit" :value="'Відновити'">
    </form>
    <div class="login-help">
      <router-link tag="a" :to="{name: 'register'}">Реєстрація</router-link> - <router-link tag="a" :to="{name: 'login'}">Увійти</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        recovery_status: null,
        recovery_status_fetching: false
      }
    },
    methods: {
      get_recovery_status() {
        this.recovery_status_fetching = true;
        this.axios.get(`/users.get_recovery_password_status?v=1`, {
          params: {
            username: this.username
          }
        }).then(response => {
          if(response.data.status == 200){
            this.recovery_status_fetching = false;
            this.recovery_status = response.data.response[0].recovery_status;
          }
        })
      },
      recovery_password(code) {
        if(code == 1) {
          this.axios.post(`/users.recovery_password`, {
            v: 1,
            code: 1,
            username: this.username
          }).then(response => {
            if(response.data.status == 200) {
              this.get_recovery_status();
            }
          })
        } else if(code == 2) {
          if(this.password.length > 5 && this.password.match(/^\w+$/)) {
            this.axios.post(`/users.recovery_password`, {
              v: 1,
              code: 2,
              username: this.username,
              password: this.password
            }).then(response => {
              if(response.data.status == 200) {
                this.$oauth.login(this.username, this.password);
              }
            })
          } else {
            return alert('Пароль повинен бути не меньше 6 символів');
          }
        }
      }
    }
  }
</script>
