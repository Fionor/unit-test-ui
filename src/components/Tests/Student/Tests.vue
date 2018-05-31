<template>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">

        <h2 class="mt-4">Доступні тести</h2>
        <div v-if="!avaliable_tests_fething" class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                  <tr>
                      <th>Назва тесту</th>
                      <th>Створив</th>
                      <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  <router-link tag="tr" class="cursor-pointer" :to="{name: 'testing', params: {id: test.id}}" v-for="(test, index) in avaliable_tests" :key="index">
                    <td>
                      {{test.name}}
                    </td>
                    <td>
                      {{test.teacher}}
                    </td>
                    <td>
                      {{test.created_at}}
                    </td>
                  </router-link>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center" v-else>
            <i class="fa fa-4x fa-spinner fa-spin"/>
        </div>

        <h2 class="mt-4">Незакінчені тести</h2>
        <div v-if="!progress_tests_fething" class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                  <tr>
                      <th>Назва тесту</th>
                      <th>Створив</th>
                      <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  <router-link tag="tr" class="cursor-pointer" :to="{name: 'testing', params: {id: test.id}}" v-for="(test, index) in progress_tests" :key="index">
                    <td>
                      {{test.name}}
                    </td>
                    <td>
                      {{test.teacher}}
                    </td>
                    <td>
                      {{test.created_at}}
                    </td>
                  </router-link>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center" v-else>
            <i class="fa fa-4x fa-spinner fa-spin"/>
        </div>

        <h2 class="mt-4">Закінчені тести</h2>
        <div v-if="!complited_tests_fething" class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                  <tr>
                      <th>Назва тесту</th>
                      <th>Створив</th>
                      <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  <router-link tag="tr" class="cursor-pointer" :to="{name: 'testing', params: {id: test.id}}" v-for="(test, index) in complited_tests" :key="index">
                    <td>
                      {{test.name}}
                    </td>
                    <td>
                      {{test.teacher}}
                    </td>
                    <td>
                      {{test.created_at}}
                    </td>
                  </router-link>
                </tbody>
            </table>
        </div>
        <div class="d-flex justify-content-center" v-else>
            <i class="fa fa-4x fa-spinner fa-spin"/>
        </div>
    </main>
</template>

<script>
  import moment from 'moment';
  export default {
    data() {
      return {
        avaliable_tests_fething: false,
        progress_tests_fething: false,
        complited_tests_fething: false,
        avaliable_tests: null,
        progress_tests: null,
        complited_tests: null
      }
    },
    methods: {
      load_avaliable_tests() {
        this.avaliable_tests_fething = true;
        this.axios.get(`/students.get_avaliable_test?v=1`).then(response => {
          this.avaliable_tests_fething = false;
          this.avaliable_tests = response.data.response.map(test => {
            let local_date = moment.utc(test.created_at).toDate();
                local_date = moment(local_date).format('YYYY-MM-DD');
            test.created_at = local_date;
            return test;
          });
          this.avaliable_tests.reverse();
        })
      },
      load_progress_tests() {
        this.progress_tests_fething = true;
        this.axios.get(`/students.get_in_progress_tests?v=1`).then(response => {
          this.progress_tests_fething = false;
          this.progress_tests = response.data.response.map(test => {
            let local_date = moment.utc(test.created_at).toDate();
                local_date = moment(local_date).format('YYYY-MM-DD');
            test.created_at = local_date;
            return test;
          });
          this.progress_tests.reverse();
        })
      },
      load_complited_tests() {
        this.complited_tests_fething = true;
        this.axios.get(`/students.get_complited_tests?v=1`).then(response => {
          this.complited_tests_fething = false;
          this.complited_tests = response.data.response.map(test => {
            let local_date = moment.utc(test.created_at).toDate();
                local_date = moment(local_date).format('YYYY-MM-DD');
            test.created_at = local_date;
            return test;
          });
          this.complited_tests.reverse();
        })
      }
    },
    created() {
      this.load_avaliable_tests();
      this.load_progress_tests();
      this.load_complited_tests();
    }
  }
</script>
