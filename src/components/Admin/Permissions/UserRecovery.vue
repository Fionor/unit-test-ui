<template>
  <div>
    <h2 @click="load_data()" class="cursor-pointer">Відновлення</h2>
    <div v-if="!data_fetching" class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>ФІО</th>
            <th>Роль</th>
            <th>Група</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <td>{{user.fio}}</td>
            <td>{{user.role == 'teacher'? 'Викладач' : 'Студент'}}</td>
            <td>{{user.role == 'teacher'? '-' : user.group.name}}</td>
            <td>
                <i @click="recovery(user.id, 'set')" class="fa fa-plus" aria-hidden="true"></i>
                <i @click="recovery(user.id, 'delete')" class="fa fa-times" aria-hidden="true"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center" v-if="data_fetching">
        <i class="fa fa-4x fa-spinner fa-spin"/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data_fetching: true,
        users: null
      }
    },
    methods: {
      load_data() {
        this.data_fetching = true;
        this.axios.get(`/users.get_recovery_users?v=1`).then(response => {
          if(response.data.status == 200){
            this.users = response.data.response
            this.data_fetching = false;
          }
        })
      },
      recovery(user_id, command) {
        if(command == 'set' || confirm("Відхилити?")){
          this.axios.post(`/users.recovery`, {
            v: '1',
            command,
            id: user_id
          }).then(response => {
            if(response.data.status == 200) {
              this.load_data();
            }
          })
        }
      },
    },
    created() {
      this.load_data();
    }
  }
</script>
