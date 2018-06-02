<template>
    <div>
        <h2>Встановлення доступів</h2>
        <div class="row justify-content-between" v-if="search_users">
            <select v-model="count" class="form-control col-4">
                <option :value="10" disabled>Кількість користувачів</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
            </select>
            <input v-model="search_fio" type="text" class="form-control col-5" placeholder="ФІО"/>
            
        </div>
        <div v-if="!data_fetching && search_users" class="table-responsive mt-3">
            <table class="table table-striped table-sm">
                <thead>
                <tr>
                    <th>ФІО</th>
                    <th>Роль</th>
                    <th>Група</th>
                </tr>
                </thead>
                <tbody>
                <tr @click="load_user(user.id)" v-for="(user, index) in users" :key="index" class="cursor-pointer">
                    <td>{{user.fio}}</td>
                    <td>{{user.role == 'teacher'? 'Викладач' : 'Студент'}}</td>
                    <td>{{user.role == 'teacher'? '-' : user.group}}</td>
                </tr>
                </tbody>
            </table>
            <nav class="pagination-sm">
                <ul class="pagination mb-0">
                    <li @click="offset != 0 ? change_page(0) : null" class="page-item" :class="offset == 0 ? 'disabled' : ''">
                        <a class="page-link" href="#" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
                    <li @click="change_page(offset - count * 2)" v-if="(offset / count -1) >= 1" class="page-item"><a class="page-link" href="#">{{offset / count - 1}}</a></li>
                    <li @click="change_page(offset - count)" v-if="(offset / count) >= 1" class="page-item"><a class="page-link" href="#">{{offset / count}}</a></li>
                    <li class="page-item disabled"><a class="page-link" href="#">{{ offset / count + 1}}</a></li>
                    <li @click="change_page(offset + count)" v-if="(offset / count + 2) <= Math.ceil(all_users / count)" class="page-item"><a class="page-link" href="#">{{offset / count + 2}}</a></li>
                    <li @click="change_page(offset + count * 2)" v-if="(offset / count + 3) <= Math.ceil(all_users / count)" class="page-item"><a class="page-link" href="#">{{offset / count + 3}}</a></li>
                    <li @click="offset + count < all_users ? change_page((Math.ceil(all_users/count) -1) * count) : null" class="page-item" :class="offset + count < all_users ? '' : 'disabled'">
                        <a class="page-link" href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div v-if="!data_fetching && !search_users" class="table-responsive mt-3">
            <span class="cursor-pointer" @click="load_users()">← Повернутись назад</span>
            <h4>{{user.fio}}</h4>
            <div class="mt-3 d-flex flex-wrap">
                <div class="form-group form-check mr-4">
                    <input @change="set_permission(1)" :checked="(user.admin_scope & 1) == 1" type="checkbox" class="form-check-input">
                    <label class="form-check-label">Змога підтверджувати зміну паролю</label>
                </div>
                <div class="form-group form-check mr-4">
                    <input @change="set_permission(2)" :checked="(user.admin_scope & 2) == 2" type="checkbox" class="form-check-input">
                    <label class="form-check-label">Змога підтверджувати аккаунт</label>
                </div>
                <div class="form-group form-check mr-4">
                    <input @change="set_permission(4)" :checked="(user.admin_scope & 4) == 4" type="checkbox" class="form-check-input">
                    <label class="form-check-label">Змога створювати групи</label>
                </div>
                <div class="form-group form-check mr-4">
                    <input @change="set_permission(16)" :checked="(user.admin_scope & 16) == 16" type="checkbox" class="form-check-input">
                    <label class="form-check-label">Змога встановлювати доступи</label>
                </div>
            </div>
            <button @click="save_permissions()" class="btn btn-success" >Зберегти</button>
        </div>
        <div class="d-flex justify-content-center" v-if="data_fetching">
            <i class="fa fa-4x fa-spinner fa-spin"/>
        </div>
    </div>
</template>

<script>
    import debounce from 'lodash.debounce'
    export default {
        data() {
            return {
                data_fetching: true,
                count: 10,
                offset: 0,
                users: [],
                all_users: 0,
                search_users: true,
                user: null,
                default_admin_scope: null,
                search_fio: ''
            }
        },
        watch: {
            search_fio(val) {
                if(val.trim().length >= 3 || val.length == 0) this.debounce_load_users();
            },
            count(val) {
                this.offset = 0;
                this.load_users();
            }
        },
        methods: {
            load_users() {
                this.data_fetching = true;
                this.search_users = true;
                return this.axios.get(`/users.get_offset_users?v=1`, {
                    params: {
                        offset: this.offset,
                        count: this.count,
                        fio: this.search_fio
                    }
                }).then(response => {
                    if(response.data.status == 200) {
                        this.data_fetching = false;
                        this.users = response.data.response;
                        this.all_users = response.data.meta.users_count;
                    }
                })
            },
            debounce_load_users: debounce(function () {
                this.offset = 0;
                this.load_users();
            }, 700),
            load_user(user_id) {
                this.search_users = false;
                this.data_fetching = true;
                return this.axios.get('/users.get?v=1', {
                    params: {
                        user_ids: user_id
                    }
                }).then(response => {
                    this.data_fetching = false;
                    this.user = response.data.response[0].user;
                    this.default_admin_scope = this.user.admin_scope;
                })
            },
            set_permission(permission) {
                this.user.admin_scope = Number(this.user.admin_scope ^ permission);
            },
            save_permissions() {
                this.data_fetching = true;
                let permissions = [];
                if((this.default_admin_scope & 1) != (this.user.admin_scope & 1) ) permissions.push('ACCESS_VERIFICATION_PASSWORD')
                if((this.default_admin_scope & 2) != (this.user.admin_scope & 2)) permissions.push('ACCESS_VERIFICATION_ACCOUNT')
                if((this.default_admin_scope & 4) != (this.user.admin_scope & 4)) permissions.push('ACCESS_CREATE_GROUPS')
                if((this.default_admin_scope & 16) != (this.user.admin_scope & 16)) permissions.push('ACCESS_ADMIN')
                return this.axios.post(`/users.set_permissions`, {
                    v: 1,
                    user_id: this.user.id,
                    permissions
                }).then(response => {
                    if(response.data.status == 200) {
                        this.load_user(this.user.id);
                    }
                })
            },
            change_page(offset){
                this.offset = offset;
                this.load_users();
            }
        },
        created() {
            this.load_users();
        }
    }
</script>

