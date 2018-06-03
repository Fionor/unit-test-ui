<template>
    <main v-if="!test_fetching" role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1>Тест</h1>
            <div class="row">
                <h2 v-if="test && test.state == 'not_defined'" @click="delete_test()" class="mr-3"><span class="badge badge-danger cursor-pointer">Видалити</span></h2>
                <h2 v-if="test && test.state == 'not_defined'" @click="begin_testing()"><span class="badge badge-warning cursor-pointer">Розпочати тестування</span></h2>
                <h2 v-if="test && test.state == 'in_progress'" @click="end_testing()"><span class="badge badge-success cursor-pointer">Закінчити тестування</span></h2>
                <h2 v-if="test && test.state == 'complited'"><span class="badge badge-info">Тестування завершено</span></h2>
            </div>
        </div>
        <form @submit="e => e.preventDefault()">
            <div class="form-row"> <!-- header -->
                <div class="form-group col">
                    <label>Назва</label>
                    <input type="text" v-model="test.name" class="form-control" >
                </div>
                <div class="form-row col">
                    <div class="form-group col">
                        <label>Вибрані групи</label>
                        <select multiple @change="e => delete_group(e)" class="form-control" id="exampleFormControlSelect2">
                            <option value="">Вибрані групи</option>
                            <option v-for="(group, index) in selected_groups" :key="index" :value="group.id">
                                {{group.name}}
                            </option>
                        </select>
                    </div>
                    <div class="form-group col">
                        <label>{{groups_fetching ? 'Завантаження...' : 'Групи'}}</label>
                        <select v-model="selected_group" @change="e => select_group(e)" v-if="!groups_fetching" class="form-control" id="exampleFormControlSelect1">
                            <option value="">Виберіть групу</option>
                            <option v-for="(group, index) in groups" :key="index" :value="group.id">
                                {{group.name}}
                            </option>
                        </select>
                    </div>
                </div>
            </div> <!-- /header -->
            <button class="btn btn-dark d-block" @click="add_variant()">Додати варіант</button>

            <div class="variant pl-3 mt-3" v-for="(variant, v_index) in test.variants" :key="v_index">
                <div class="d-flex justify-content-between">
                    <h4 >Варіант {{v_index+1}}</h4>
                    <h4><span @click="delete_variant(v_index)" class="badge badge-danger">Видалити</span></h4>
                </div>
                <button class="btn btn-dark" @click="add_question(v_index)">Додати питання</button>
                <div v-for="(question, q_index) in variant.questions" :key="q_index" class="question mt-1 pl-3">
                    <div class="form-group">
                        <div class="d-flex justify-content-between">
                            <label class="text-primary font-weight-bold">В: {{v_index + 1}} Питання {{q_index + 1}}</label>
                            <h5><span @click="delete_question(v_index, q_index)" class="badge badge-danger">Видалити</span></h5>
                        </div>
                        <div v-if="question.image_id != ''" class="d-flex justify-content-center qustion-image mb-3">
                            <img  @click="delete_image(v_index, q_index)" :src="`${axios.defaults.baseURL}/photos.get?v=1&photo_id=${question.image_id}`" class="img-fluid img-thumbnail">
                        </div>
                        <textarea v-model="question.name" class="form-control" rows="3"></textarea>
                    </div>

                    <div v-if="question.image_id == ''" class="form-group">
                        <label for="exampleFormControlFile1">Додати фотографію</label>
                        <input @change="e => add_image(v_index, q_index, e)" type="file" class="form-control-file" id="exampleFormControlFile1">
                    </div>

                    <button class="btn btn-dark" @click="add_answer(v_index, q_index)">Додати відповідь</button>
                    <div class="answers">
                        <div v-for="(answer, a_index) in question.answers" :key="a_index" class="form-group form-check">
                            <div class="d-flex justify-content-between">
                                <label @click="set_true_answer(v_index, q_index, a_index)" class="form-check-label font-weight-bold cursor-pointer" :class="answer.right ? 'text-success' : 'text-danger'">
                                    В: {{v_index + 1}} П: {{q_index + 1}} Відповідь {{a_index + 1}}
                                </label>
                                <h6><span @click="delete_answer(v_index, q_index, a_index)" class="badge badge-danger">Видалити</span></h6>
                            </div>

                            <textarea v-model="answer.text" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <button v-if="$route.meta.edit && test.state == 'not_defined'" @click="create_test()" type="button" class="btn mt-3 mb-3" :class="test_errors.length == 0 ? 'btn-success' : 'btn-danger'">Зберегти</button>
            <button v-else-if="!$route.meta.edit" @click="create_test()" type="button" class="btn mt-3 mb-3" :class="test_errors.length == 0 ? 'btn-success' : 'btn-danger'">Створити</button>
            <div class="mb-4">
                <h1>Статистика</h1>
                <div v-for="(student, index) in students_statistic" :key="index">
                    <div >
                        <h5 class="col-4">ФІО: {{student.fio}}</h5>
                        <h5 class="col-2">Варіант: {{student.variant + 1}}</h5>
                        <h5 class="col-4">П/В: {{student.true_answers}}</h5>
                        <h5 class="col-4">Успішність: {{student.success}}%</h5>
                    </div>

                    <div v-for="(question, q_index) in student.questions" :key="q_index" class="question mt-1 pl-3">
                        <div >
                            <div class="d-flex justify-content-between">
                                <label class="font-weight-bold" :class="question.right ? 'text-success' : 'text-danger'">Питання {{q_index + 1}}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </main>
    <main v-else role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <div class="d-flex justify-content-center mt-5" >
            <i class="fa fa-4x fa-spinner fa-spin"/>
        </div>
    </main>
</template>

<script>
    import io from 'socket.io-client';
    export default {
        data() {
            return {
                test: {
                    name: '',
                    for_groups: [],
                    variants: []
                },
                groups_fetching: true,
                test_fetching: false,
                groups: null,
                selected_group: '',
                students_statistic: [],
                socket: null
            }
        },
        methods: {
            load_groups() {
                return this.axios.get('/groups.get?v=1').then(response => {
                    if(response.data.status == 200){
                        this.groups_fetching = false;
                        this.groups = response.data.response[0].groups;
                    }
                })
            },
            select_group(e) {
                const group_id = e.target.value;
                if(this.test.for_groups.indexOf(group_id) == -1){
                    this.test.for_groups.push(group_id);
                }
                this.selected_group = '';
            },
            delete_group(e) {
                const group_id = e.target.value;
                this.test.for_groups = this.test.for_groups.filter(g_id => g_id != group_id );
            },
            add_variant() {
                this.test.variants.push({
                    questions: []
                })
            },
            delete_variant(index) {
                if(confirm(`Видалити ${index + 1} варіант?`)) this.test.variants.splice(index, 1);
            },
            add_question(v_index) {
                this.test.variants[v_index].questions.push({
                    name: '',
                    answers: [],
                    image_id: ''
                })
            },
            delete_question(v_index, q_index) {
                if(confirm(`Видалити ${q_index + 1} питання ${v_index + 1} варіанту?`)) this.test.variants[v_index].questions.splice(q_index, 1);
            },
            add_answer(v_index, q_index) {
                this.test.variants[v_index].questions[q_index].answers.push({
                    text: '',
                    right: false
                })
            },
            delete_answer(v_index, q_index, a_index) {
                if(confirm(`Видалити ${a_index + 1} відповідь ${q_index + 1} питання ${v_index + 1} варіанту?`)) this.test.variants[v_index].questions[q_index].answers.splice(a_index, 1);
            },
            set_true_answer(v_index, q_index, a_index) {
                this.test.variants[v_index].questions[q_index].answers.map((answer, index) => {
                    if(index == a_index) answer.right = true;
                    else answer.right = false;
                    return answer;
                })
            },
            add_image(v_index, q_index, e) {
                console.log('add image')
                const fileName = e.target.files[0].name;
                const idxDot = fileName.lastIndexOf(".") + 1;
                const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

                if (extFile=="jpg" || extFile=="jpeg" || extFile=="png"){
                    let fb = new FormData();
                    fb.append('v', 1);
                    fb.append('photo', e.target.files[0])
                    this.axios.post(`/photos.create`, fb).then(response => {
                        if(response.data.status == 200){
                            const res = response.data.response[0];
                            this.test.variants[v_index].questions[q_index].image_id = res.photo_id;
                        }
                    })
                }else{
                    alert("Only jpg/jpeg and png files are allowed!");
                }
            },
            delete_image(v_index, q_index) {
                if(confirm(`Вдалити ілюстрацію до ${q_index + 1} питання ${v_index  + 1} варіанту?`)) {
                    this.test.variants[v_index].questions[q_index].image_id = '';
                    delete this.test.variants[v_index].questions[q_index].image_used;
                }
            },
            create_test() {
                if(this.test_errors.length > 0){
                    alert(this.test_errors.reduce((p,n) => `${p}\n${n}`, ''))
                } else {
                    this.test_fetching = true;
                    this.axios.post('/tests.save', {
                        v: 1,
                        ...this.test
                    }).then(response => {
                        this.test_fetching = false;
                        if(response.data.status == 200) {
                            if(this.$route.meta.edit) this.load_test();
                            else {
                                this.$router.push({name: 'test', params: {id: response.data.response[0].test_id}})
                                this.load_test().then(() => this.socket_init());
                            }
                        }
                    })
                }
            },
            load_test() {
                this.test_fetching = true;
                return this.axios.get('/tests.get_one?v=1', {params: {
                    id: this.$route.params.id
                }}).then(response => {
                    if(response.data.status == 200){
                        this.test = response.data.response[0];
                        this.test_fetching = false;
                    } else {
                        this.$router.push({name: 'tests'})
                    }
                });
            },
            load_student_statistic(student_id) {
                return this.axios.get(`/tests.get_users_statistic?v=1`, {
                    params: {
                        test_id: this.$route.params.id,
                        student_id
                    }
                }).then(response => {
                    if(response.data.status == 200){
                        this.students_statistic.push(response.data.response[0])
                    }
                })
            },
            delete_test() {
                this.test_fetching = true;
                this.axios.post(`/tests.remove`, {
                    v: 1,
                    id: this.$route.params.id
                }).then(response => {
                    this.test_fetching = false;
                    
                    if(response.data.status == 200){
                        this.$router.push({name: 'tests'})
                    }
                });
            },
            begin_testing() {
                this.test_fetching = true;
                this.axios.post(`/tests.begin_testing`, {
                    id: this.$route.params.id,
                    v: 1
                }).then((response) => {
                    this.test_fetching = false;
                    if(response.data.status == 200) {
                        this.load_test();
                    }
                });
            },
            end_testing() {
                this.test_fetching = true;
                this.axios.post(`/tests.end_testing`, {
                    id: this.$route.params.id,
                    v: 1
                }).then((response) => {
                    this.test_fetching = false;
                    if(response.data.status == 200) {
                        this.load_test();
                    }
                });
            },
            socket_init(){ 
                this.socket = io(this.$socket_url, {
                    query: {
                        room: this.$route.params.id
                    }
                });
                this.socket.on('update_statistic', data => {
                    let index = -1;
                    this.students_statistic.forEach((student, i) => {
                        if(student.user_student_id == data.statistic.user_student_id) index = i;
                    })
                    if(index != -1){
                        this.$set(this.students_statistic, index, data.statistic);
                    } else {
                        this.students_statistic.push(data.statistic);
                    }
                })
            }
        },
        computed: {
            selected_groups() {
                let groups = [];
                this.test.for_groups.map(group_id => {
                    let group_name = this.groups.filter(gr => gr.id == group_id)[0].name;
                    groups.push({id: group_id, name: group_name})
                })
                return groups;
            },
            test_errors() {
                let errors = [];
                if(this.test.name == ''){
                    errors.push(`Тест: відсутня назва тесту`);
                }
                if(this.test.for_groups.length == 0){
                    errors.push(`Тест: відсутні групи для опитування`);
                }
                if(this.test.variants.length == 0){
                    errors.push(`Тест: відсутні варіанти`);
                }
                for (let i = 0; i < this.test.variants.length; i++) {
                    if(this.test.variants[i].questions == undefined || this.test.variants[i].questions.length == 0){
                        errors.push(`Варіант ${i+1}: відсутні питання`);
                        continue;
                    }
                    for (let j = 0; j < this.test.variants[i].questions.length; j++) {
                        if(this.test.variants[i].questions[j].name == undefined || this.test.variants[i].questions[j].name == ''){
                            errors.push(`Варіант ${i+1} -> Питання ${j+1}: відсутній текст питання`);
                        }
                        if(this.test.variants[i].questions[j].answers == undefined || this.test.variants[i].questions[j].answers.length == 0){
                            errors.push(`Варіант ${i+1} -> Питання ${j+1}: відсутні відповіді`);
                            continue;
                        }
                        let true_answers = 0;
                        for (let l = 0; l < this.test.variants[i].questions[j].answers.length; l++) {
                            if(this.test.variants[i].questions[j].answers[l].text == undefined || this.test.variants[i].questions[j].answers[l].text == ''){
                                errors.push(`Варіант ${i+1} -> Питання ${j+1} -> Відповідь ${l+1}: відсутній текст відповіді`);
                            }
                            if(this.test.variants[i].questions[j].answers[l].right == true) true_answers = true_answers + 1;
                        }
                        if(true_answers == 0 || true_answers > 1){
                            errors.push(`Варіант ${i+1} -> Питання ${j+1}: питання має більше 1ї правильної відповіді`);
                        }
                    }
                }
                return errors;
            }
        },
        created() {
            this.load_groups().then(() => {
                if(this.$route.meta.edit){
                    this.load_test().then(() => {
                        this.test.subscribers.forEach(subscriber => {
                            this.load_student_statistic(subscriber);
                        })
                        this.socket_init();
                    });
                }
            });
        },
        beforeDestroy() {
            if(this.socket) {
                this.socket.disconnect();
            }
        }
    }
</script>

<style scoped>
.qustion-image{
    height: 256px;
    text-align: center;
    
}

.qustion-image > img {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    width: auto;
    margin: auto;
}
</style>
