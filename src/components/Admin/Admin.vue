<template>
    <main v-if="$store.state.user" role="main" class="container">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Адміністрування</h1>
        </div>
        <user-recovery v-if="Number($store.state.user.admin_scope & 1) == 1"/>
        <user-validate v-if="Number($store.state.user.admin_scope & 2) == 2"/>
        <create-groups v-if="Number($store.state.user.admin_scope & 4) == 4"/>
        <set-access v-if="Number($store.state.user.admin_scope & 16) == 16"/>
    </main>
</template>

<script>
    import UserValidate from './Permissions/UserValidate'
    import UserRecovery from './Permissions/UserRecovery'
    import CreateGroups from './Permissions/CreateGroups'
    import SetAccess from './Permissions/SetAccess'
    export default {
        components: {
            UserValidate,
            UserRecovery,
            CreateGroups,
            SetAccess
        }
    }
</script>

