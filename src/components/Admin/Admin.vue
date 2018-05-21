<template>
    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Адміністрування</h1>
        </div>
        <user-recovery v-if="Number($store.state.user.admin_scope & 1) == 1"/>
        <user-validate v-if="Number($store.state.user.admin_scope & 2) == 2"/>
    </main>
</template>

<script>
    import UserValidate from './Permissions/UserValidate'
    import UserRecovery from './Permissions/UserRecovery'
    export default {
        components: {
            UserValidate,
            UserRecovery
        }
    }
</script>

