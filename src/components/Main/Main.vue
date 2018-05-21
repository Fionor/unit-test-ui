<template>
  <teacher-main v-if="$store.state.user && $store.state.user.role == 'teacher'"/>
</template>

<script>
  import TeacherMain from './Teacher/Main'
  export default {
    components: {
      TeacherMain
    }
  }
</script>
