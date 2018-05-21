<template>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1>Тест</h1>
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
                        <label>{{groups_fetching ? 'Завантаження' : 'Групи'}}</label>
                        <select v-model="selected_group" @change="e => select_group(e)" v-if="!groups_fetching" class="form-control" id="exampleFormControlSelect1">
                            <option value="">Виберіть групу</option>
                            <option v-for="(group, index) in groups" :key="index" :value="group.id">
                                {{group.name}}
                            </option>
                        </select>
                    </div>
                </div>
            </div> <!-- /header -->
            <button class="btn btn-dark" @click="add_variant()">Додати варіант</button>

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
                        <textarea v-model="question.name" class="form-control" rows="3"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="exampleFormControlFile1">Додати фотографію</label>
                        <input type="file" class="form-control-file" id="exampleFormControlFile1">
                    </div>

                    <button class="btn btn-dark" @click="add_answer(v_index, q_index)">Додати відповідь</button>
                    <div class="answers">
                        <div v-for="(answer, a_index) in question.answers" :key="a_index" class="form-group form-check">
                            <div class="d-flex justify-content-between">
                                <label class="form-check-label font-weight-bold" :class="answer.right ? 'text-success' : 'text-danger'">
                                    В: {{v_index + 1}} П: {{q_index + 1}} Відповідь {{a_index + 1}}
                                </label>
                                <h6><span @click="delete_answer(v_index, q_index, a_index)" class="badge badge-danger">Видалити</span></h6>
                            </div>
                            <input v-model="answer.right" :value="true" class="form-check-input" type="radio" :name="`${v_index}_${q_index}_${a_index}`">
                            <input v-model="answer.right" :value="false" class="form-check-input mt-4" type="radio" :name="`${v_index}_${q_index}_${a_index}`">

                            <textarea v-model="answer.text" class="form-control" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </main>
</template>

<script>
    export default {
        data() {
            return {
                test: {
                    name: '',
                    for_groups: [],
                    variants: []
                },
                groups_fetching: true,
                groups: null,
                selected_group: ''
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
            }
        },
        created() {
            this.load_groups();
        }
    }
</script>

