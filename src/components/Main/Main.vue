<template>
  <teacher-main v-if="$store.state.user && $store.state.user.role == 'teacher'"/>
  <student-main v-else/>
</template>

<script>
  import TeacherMain from './Teacher/Main'
  import StudentMain from './Student/Main'
  export default {
    components: {
      TeacherMain,
      StudentMain
    }
  }
</script>
