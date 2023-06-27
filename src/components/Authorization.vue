<template>
  <div>
    <v-snackbar v-model="errorAuthSnackbar">
      {{ textErrorSnackbar }}
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="errorAuthSnackbar = false">
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
    <v-card style="padding: 20px; margin: 5% 30%" elevation="9">
      <v-col style="justify-content: space-around; justify-content: center">
        <v-row>
          <v-text-field variant="outlined" v-model="login" label="Логин"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field type="password" v-model="password" variant="outlined" label="Пароль"></v-text-field>
        </v-row>
        <v-row style="justify-content: center; margin-top: 5px">
          <v-btn @click="authorization()" style="margin: 10px;" color="blue" outlined>Вход</v-btn>
          <v-btn style="margin: 10px;" to="registration" color="blue" outlined>Регистрация</v-btn>
        </v-row>
        <v-col style="text-align: center; margin-top: 10px;">
          <v-card color="blue-lighten-4">
            <v-btn color="blue" style="margin: 10px;" @click="login = 'first@mail.ru', password = '123123'">Оператор
              первой
              линии</v-btn>
            <v-btn color="blue" style="margin: 10px;" @click="login = 'second@mail.ru', password = '123123'">Оператор
              второй
              линии</v-btn>
            <v-btn color="blue" style="margin: 10px;" @click="login = 'manager@mail.ru', password = '123123'">Сервис
              менеджер</v-btn>
          </v-card>
        </v-col>
      </v-col>
    </v-card>
  </div>
</template>

<script>
import axios from "axios"

export default ({
  data() {
    return {
      login: null,
      password: null,
      api: process.env.VUE_APP_ENV_API,
      textErrorSnackbar: null,
      errorAuthSnackbar: false,
    }
  },
  methods: {
    authorization() {
      axios.post(this.api + 'api/auth/login', { email: this.login, password: this.password }).then(res => {
        localStorage.setItem('access_token', res.data.access_token);
        this.getMe();
      }).catch(error => {
        if (error.response) {
          this.textErrorSnackbar = "Неверный логин или пароль",
            this.errorAuthSnackbar = true
        }
      })
    },
    getMe() {
      axios.post(this.api + 'api/auth/me', null, {
        headers: {
          'authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      }).then(responce => {
        localStorage.setItem('auth', responce.data.role);
        localStorage.setItem('userId', responce.data.id);
        this.$router.push('/');
      })
    }
  }
})
</script>