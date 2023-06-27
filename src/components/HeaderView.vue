<template>
  <v-snackbar v-model="errorAuthSnackbar">
    {{ textErrorSnackbar }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="errorAuthSnackbar = false">
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
  <div>
    <v-toolbar color="blue" class="d-flex justify-space-around" elevation="4" title="Управление оказанием IT-услуг">
      <v-btn variant="tonal" v-if="visibleAuth" @click="exit()"> Выход </v-btn>
    </v-toolbar>
  </div>
</template>

<script>

export default {

  data() {
    return {
      visibleAuth: null,
      textErrorSnackbar: null,
      errorAuthSnackbar: false,
    }
  },
  watcher: {
    '$route': 'authorization'

  },
  created() {
    this.authorization();
  },
  methods: {
    exit() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('userId');
      localStorage.removeItem('auth');
      this.$router.push('auth');
    },
    authorization() {
      if (localStorage.getItem('access_token') == null) {
        this.visibleAuth = false;
      }
      else {
        this.visibleAuth = true;
      }
    }
  },
};
</script>

<style></style>