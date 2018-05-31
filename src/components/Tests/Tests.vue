<template>
  <teacher-tests v-if="$store.state.user && $store.state.user.role == 'teacher'"/>
  <stundet-tests v-else/>
</template>

<script>
  import TeacherTests from './Teacher/Tests'
  import StundetTests from './Student/Tests'
  export default {
    components: {
      TeacherTests,
      StundetTests
    }
  }
</script>
