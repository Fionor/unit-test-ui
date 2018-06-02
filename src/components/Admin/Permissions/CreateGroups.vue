<template>
  <div>
    <h2 @click="load_data()" class="cursor-pointer">Створення груп</h2>
    <div v-if="!data_fetching" class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th>Група</th>
            <th>Кількість студентів</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(group, index) in groups" :key="index">
              <td>
                {{group.name}}
              </td>
              <td>
                {{group.members}}
              </td>
              <td>
                <i v-if="group.members == 0" @click="delete_group(group.id)" class="fa fa-times" aria-hidden="true"></i>
              </td>
          </tr>
          <tr>
            <td>
              <input type="text" v-model="group_name" placeholder="Створити групу">
            </td>
            <td></td>
            <td>
              <i @click="create_group()" class="fa fa-plus" aria-hidden="true"></i>
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
        groups: null,
        group_name: ''
      }
    },
    methods: {
      load_data() {
        this.data_fetching = true;
        this.axios.get('/groups.get?v=1').then(response => {
          this.data_fetching = false;
          this.groups = response.data.response[0].groups;
        });
      },
      delete_group(id) {
        if(confirm('Видалити групу?')){
          this.data_fetching = true;
          this.axios.post('/groups.delete', {
            v: 1,
            id
          }).then(response => {
            if(response.data.status == 200){
              this.load_data();
            }
          })
        }
      },
      create_group() {
        this.data_fetching = true;
        this.axios.post('/groups.create', {
          v: 1,
          name: this.group_name
        }).then(response => {
          if(response.data.status == 200){
            this.load_data();
          }
        })
      }
    },
    created() {
      this.load_data();
    }
  }   
</script>
