<template>
    <main class="container">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <router-link :to="{name: 'create-test'}" type="button" tag="button" class="btn btn-secondary">
                Створити тест
            </router-link>
        </div>

        <h2>Створенні тести</h2>
        <div v-if="!data_fetching" class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                <tr>
                    <th>Назва тесту</th>
                    <th>Підписників</th>
                    <th>Статус</th>
                    <th>Дата</th>
                </tr>
                </thead>
                <tbody>
                <router-link tag="tr" :to="{name: 'test', params: {id: test._id}}" v-for="(test, index) in data" :key="index" class="cursor-pointer">
                    <td>{{test.name}}</td>
                    <td>{{test.subscribers.length}}</td>
                    <td>{{test.state_text}}</td>
                    <td>{{test.created_at}}</td>
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
                data: null,
                data_fetching: true,
                moment
            }
        },
        methods: {
            load_data() {
                this.data_fetching = true;
                this.axios.get('/tests.get_created?v=1').then(response => {
                    this.data_fetching = false;
                    this.data = response.data.response;
                    this.data.map(test => {
                        switch (test.state) {
                            case 'not_defined':
                                test.state_text = 'Тестування не розпочате';
                                break;
                            case 'in_progress':
                                test.state_text = 'Відбувається тестування';
                                break;
                            case 'complited':
                                test.state_text = 'Тестування завершено';
                                break;
                        }
                        let local_date = moment.utc(test.created_at).toDate();
                            local_date = moment(local_date).format('YYYY-MM-DD HH:mm');
                        test.created_at = local_date;
                        return test;
                    })
                    this.data.reverse();
                })
            }
        },
        created() {
            this.load_data();
        }
    }
</script>
