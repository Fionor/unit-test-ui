<template>
  <main v-if="!data_fetcing" role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">

    <div v-if="next_step.status == 'not_begined'">
      <h1 style="text-align: center;" class="mb-4">Виберіть варіант</h1>
      <select v-model="variant" class="form-control">
        <option :value="variant" v-for="variant in  next_step.variants_count" :key="variant">
          Варіант {{variant}}
        </option>
      </select> 
      <button @click="begin_testing()" type="button" class="btn mt-3 mb-3 btn-success">Розпочати</button>  
    </div>

    <div v-if="next_step.status == 'testing'" class="mt-3">
      <div class="form-group">
          <div class="d-flex justify-content-between">
              <label class="text-primary font-weight-bold">Питання</label>
          </div>
          <div v-if="next_step.question.image_id != ''" class="d-flex justify-content-center qustion-image mb-3">
              <img :src="`${axios.defaults.baseURL}/photos.get?v=1&photo_id=${next_step.question.image_id}`" class="img-fluid img-thumbnail">
          </div>
          <textarea v-model="next_step.question.name" disabled class="form-control" rows="3"></textarea>
      </div>
      <div class="answers">
          <div v-for="(answer, a_index) in next_step.question.answers" :key="a_index" class="form-group form-check">
              <div class="d-flex justify-content-between">
                  <label class="form-check-label font-weight-bold cursor-pointer" @click="selected_answer = a_index" :class="selected_answer == a_index ? 'text-success' : 'text-danger'">
                    Відповідь {{a_index + 1}}
                  </label>
              </div>

              <textarea v-model="answer.text" disabled class="form-control" rows="3"></textarea>
          </div>
      </div>
      <button @click="set_answer()" type="button" class="btn mt-3 mb-3 btn-success">Далі</button>
    </div>

    <div v-if="next_step.status == 'complited'">
      <h1 style="text-align: center;" class="mb-4">Тестування завершено</h1>
      <div class="row">
        <h4 class="col-2 d-flex justify-content-center">Варіант: {{next_step.stats.variant + 1}}</h4>
        <h4 class="col-6 d-flex justify-content-center">Правильних відповідей: {{next_step.stats.true_answers}}</h4>
        <h4 class="col-4 d-flex justify-content-center">Успішність: {{next_step.stats.success}}%</h4>
      </div>

      <div v-for="(question, q_index) in next_step.stats.questions" :key="q_index" class="question mt-1 pl-3">
          <div class="form-group">
              <div class="d-flex justify-content-between">
                  <label class="text-primary font-weight-bold">Питання {{q_index + 1}}</label>
              </div>
              <div v-if="question.image_id != ''" class="d-flex justify-content-center qustion-image mb-3">
                  <img :src="`${axios.defaults.baseURL}/photos.get?v=1&photo_id=${question.image_id}`" class="img-fluid img-thumbnail">
              </div>
              <textarea disabled v-model="question.name" class="form-control" rows="3"></textarea>
          </div>

          <div class="answers">
              <div  class="form-group form-check">
                  <div class="d-flex justify-content-between">
                      <label  class="form-check-label font-weight-bold cursor-pointer" :class="question.right ? 'text-success' : 'text-danger'">
                          Відповідь
                      </label>
                  </div>

                  <textarea disabled v-model="question.text" class="form-control" rows="3"></textarea>
              </div>
          </div>
      </div>
    </div>

  </main>
  <main v-else role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
    <div class="d-flex justify-content-center mt-5" >
      <i class="fa fa-4x fa-spinner fa-spin"/>
    </div>
  </main>
</template>

<script>
  export default {
    data() {
      return {
        data_fetcing: true,
        next_step: null,
        variant: 1,
        selected_answer: null
      }
    },
    methods: {
      get_next_step() {
        this.data_fetcing = true;
        this.selected_answer = null;
        this.axios.get(`/tests.get_next_step?v=1`, {
          params: {
            id: this.$route.params.id
          }
        }).then(response => {
          this.data_fetcing = false;
          if(response.data.status == 200){
            this.next_step = response.data.response[0];
          } else {
            this.$router.push({name: 'tests'})
          }
        })
      },
      begin_testing() {
        this.data_fetcing = true;
        this.axios.post('/students.begin_testing', {
          v: 1,
          variant: this.variant - 1,
          test_id: this.$route.params.id
        }).then(response => {
          if(response.data.status == 200){
            this.get_next_step();
          } else {
            this.$router.push({name: 'tests'})
          }
        })
      },
      set_answer() {
        if(this.selected_answer != null){
          this.data_fetcing = true;
          this.axios.post('/students.set_answer', {
            v: 1,
            answer: this.selected_answer,
            test_id: this.$route.params.id
          }).then(response => {
            if(response.data.status == 200){
              this.get_next_step();
            } else {
              this.$router.push({name: 'tests'})
            }
          })
        } else {
          alert('Виберіть відповідь.')
        }
      }
    },
    created() {
      this.get_next_step();
    }
  }
</script>
