<template>
  <div>
    <v-row style="margin: 15px">
      <v-btn to="/" class="ma-2" color="blue" outlined v-if="auth == 3 || auth == 6 || auth == 1">Заявки</v-btn>

      <v-btn to="newApplication" class="ma-2" color="blue" outlined v-if="auth == 3 || auth == 1">Создать заявку</v-btn>
      <v-btn to="statuses" class="ma-2" color="blue" outlined v-if="auth == 6">Анализ заявок</v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: null,
    }
  },
  created() {
    this.auth = localStorage.getItem('auth');
  },
  watcher: {
    '$route': function () {
      created();
    }
  },
}
</script>

<style scoped>
.but {
  margin-left: 20px;
}
</style>