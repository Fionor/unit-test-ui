<template>
  <div class="row justify-content-center" style="margin-top: 20vh">
    <div class="col-md-6">
      <div class="card">
        <header class="card-header">
          <router-link tag="a" class="float-right btn btn-outline-primary mt-1" :to="{name: 'login'}">Увійти</router-link>
          <h4 class="card-title mt-2">Реєстрація</h4>
        </header>
        <article class="card-body">
        <form @submit="e => e.preventDefault()">
          <div class="form-group">
            <label>ФІО</label>
            <input type="email" class="form-control" v-model.trim="fio">
          </div>
          <div class="form-group">
            <label>Логін</label>
            <input type="email" class="form-control" v-model.trim="username">
          </div>
          <div class="form-row">
            <div class="col form-group">
              <label>Пароль</label>   
                <input type="password" class="form-control" v-model.trim="password">
            </div>
            <div class="col form-group">
              <label>Повторіть пароль</label>
                <input type="password" class="form-control" v-model.trim="double_password">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label>Роль</label>
              <select v-model="role" id="inputState" class="form-control">
                <option value="" disabled>Роль</option>
                <option value="student">Студент</option>
                <option value="teacher">Викладач</option>
              </select>
            </div>
            <div v-if="role == 'student'" class="form-group col-md-6">
              <label>Група</label>
              <select v-model="group_id" id="inputState" class="form-control">
                <option value="" disabled>Група</option>
                <option v-for="(group, index) in groups" :key="index" :value="group.id">
                  {{group.name}}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group">
              <button type="submit" @click="register()" class="btn btn-primary btn-block"> Реєстрація  </button>
          </div>     
        </form>
        </article> 
        <div class="border-top card-body text-center">Зареєстровані? <router-link tag="a" :to="{name: 'login'}">Увійти</router-link></div>
      </div> 
    </div> 
  </div> 
</template>

<script>
  export default {
    data() {
      return {
        role: '',
        group_id: '',
        password: '',
        username: '',
        double_password: '',
        fio: '',
        groups: null,
        groups_fetching: true
      }
    },
    methods: {
      load_groups(){
        this.axios.get('/groups.get?v=1').then(response => {
          if(response.data.status == 200){
            this.groups_fetching = false;
            this.groups = response.data.response[0].groups;
          }
        })
      },
      register() {
        if(this.username.length < 4) return alert('Логін повинен бути не меньше 4х символів');
        if(!this.username.match(/^\w+$/)) return alert('Логін повинен містити лише цифри та латинські літери');
        let fio = this.fio.trim();
        if(!fio.match(/^[А-яіїєыЫІЇЄ]+\s[А-яіїєыЫІЇЄ]+\s[А-яіїєыЫІЇЄ]+$/)) return alert('Невірний формат ФІО (Прізвище Імя По батькові кирилецею)');
        if(this.role == '') return alert('Виберіть роль');
        if(this.role == 'student' && this.group_id == '') return alert('Введіть группу');
        if(this.password != this.double_password || this.password == '' || this.double_password == '' ) return alert('Не вірно введені паролі');
        if(this.password.length < 6) return alert('Пароль повинен бути не меньше 6 символів');
        if(!this.password.match(/^\w+$/)) return alert('Пароль повинен містити лише цифри та латинські літери');
        this.$oauth.register({
          username: this.username,
          password: this.password,
          role: this.role,
          group_id: this.group_id,
          v: 1,
          fio: this.fio
        });
      }
    },
    created() {
      this.load_groups();
    }
  }
</script>

<style scoped>

</style>
