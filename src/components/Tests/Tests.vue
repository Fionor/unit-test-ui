<template>
  <teacher-tests v-if="$store.state.user && $store.state.user.role == 'teacher'"/>
</template>

<script>
  import TeacherTests from './Teacher/Tests'
  export default {
    components: {
      TeacherTests
    }
  }
</script>
