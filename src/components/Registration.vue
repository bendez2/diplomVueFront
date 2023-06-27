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
        <v-card style="padding: 20px; margin: 10% 35%" elevation="9">
            <v-col style="justify-content: space-around; justify-content: center">
                <v-row>
                    <v-text-field variant="outlined" v-model="newUser.name" label="Имя пользователя"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field variant="outlined" v-model="newUser.email" label="Логин"></v-text-field>
                </v-row>
                <v-row>
                    <v-text-field type="password" v-model="newUser.password" variant="outlined"
                        label="Пароль"></v-text-field>
                </v-row>
                <v-row style="justify-content: center; margin-top: 10px">
                    <v-btn style="margin: 5px" color="blue" @click="authorization()" outlined>Создать аккаунт</v-btn>
                    <v-btn style="margin: 5px" to="auth" color="blue" outlined>Вернуться к авторизации</v-btn>
                </v-row>
            </v-col>
        </v-card>
    </div>
</template>

<script>
import axios from "axios"

export default ({
    data() {
        return {
            newUser: {},
            api: process.env.VUE_APP_ENV_API,
            textErrorSnackbar: null,
            errorAuthSnackbar: false,
        }
    },
    methods: {
        authorization() {
            axios.post(this.api + 'api/user/create', this.newUser).then(res => {
                this.$router.push('auth');
            }).catch(error => {
                if (error.response) {
                    this.textErrorSnackbar = "Не удалось создать аккаунт",
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