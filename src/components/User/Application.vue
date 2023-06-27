<template>
    <div>
        <v-snackbar v-model="snackbar">
            Заявка успешно изменена
            <template v-slot:actions>
                <v-btn color="blue" variant="text" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>

        <v-card color="" style="margin: 15px" elevation="10">
            <v-col>
                <p bg-color="blue" style="font-size: 24px; margin: 0px 0px 10px 20px">
                    Редактирование заявки №{{ application.id }} от
                    {{ application.created_at }}
                </p>

                <v-row style="margin: 10px 0px">
                    <v-spacer></v-spacer>
                    <v-btn @click="pushapplication()" color="blue" outlined>Сохранить изменения</v-btn>
                </v-row>

                <v-tabs v-model="tab" bg-color="blue" slider-color="pink-darken-1">
                    <v-tab value="one">Заявка</v-tab>
                    <v-tab value="two">SLA</v-tab>
                </v-tabs>

                <v-card-text>
                    <v-window v-model="tab">
                        <v-window-item value="one">
                            <v-row style="padding-top: 15px">
                                <v-col>
                                    <v-autocomplete readonly v-model="application.initiator_id" :items="initiatorsApp"
                                        item-value="id" item-title="name" label="Инициатор"
                                        variant="outlined"></v-autocomplete>
                                    <v-text-field v-model="application.location" label="Место оказания услуги"
                                        variant="outlined" append-inner-icon="mdi-map-marker"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-autocomplete readonly v-model="application.status_id" :items="statusesApp"
                                        item-value="id" item-title="name" label="Статус заявки"
                                        variant="outlined"></v-autocomplete>
                                    <v-autocomplete readonly v-model="application.employee_id" :items="employeesApp"
                                        item-value="id" item-title="name" label="Исполнитель"
                                        variant="outlined"></v-autocomplete>
                                </v-col>
                            </v-row>

                            <v-textarea name="input-7-1" variant="filled" label="Текст заявки" auto-grow
                                v-model="application.text"></v-textarea>
                            <v-textarea readonly name="input-7-1" variant="filled" label="История исполнителей" auto-grow
                                v-model="application.historyexecutor"></v-textarea>
                            <v-text-field readonly variant="underlined" label="Комментарии исполнителя"></v-text-field>
                        </v-window-item>

                        <v-window-item value="two">
                            <v-col>
                                <v-row>
                                    <v-col>
                                        <v-autocomplete readonly learable v-model="nameTypeApp" label="Тип"
                                            item-title="name" item-value="id" :items="nameApps"
                                            variant="outlined"></v-autocomplete>
                                    </v-col>
                                    <v-col>
                                        <v-autocomplete readonly learable v-model="priorityTypeApp" label="Приоритет"
                                            item-title="name" item-value="id" :items="priorityApps"
                                            variant="outlined"></v-autocomplete>
                                    </v-col>
                                </v-row>

                                <v-text-field v-model="typeApp.sla" readonly label="Время выполнения согласно SLA"
                                    variant="outlined"></v-text-field>
                            </v-col>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-col>
        </v-card>
    </div>
</template>

<script>
import API from '../../assets/api.js'

export default ({
    data() {
        return {
            snackbar: false,
            nameTypeApp: null,
            priorityTypeApp: null,

            typeApp: {},

            api: process.env.VUE_APP_ENV_API,
            tab: null,
        }
    },
    props: {
        application: Object,
        initiatorsApp: Array,
        statusesApp: Array,
        typesApp: Array,
        nameApps: Array,
        priorityApps: Array,
        employeesApp: Array,
    },
    mounted() {
        this.nameTypeApp = this.application.nameIdApplication;
        this.priorityTypeApp = this.application.nameIdPriority;
    },
    watch: {
        nameTypeApp() {
            this.searchTypeApp();
        },
        priorityTypeApp() {
            this.searchTypeApp();
        }
    },
    methods: {
        searchTypeApp() {
            if (this.nameTypeApp != null && this.priorityTypeApp != null && this.typesApp[0] != null) {
                this.typeApp = this.typesApp.filter(c => c.nameapplications_id == this.nameTypeApp && c.priorities_id == this.priorityTypeApp)[0];
                this.application.type_id = this.typeApp.id;
            }
        },
        pushapplication() {
            API.put(this.api + "api/auth/applications", this.application)
                .finally(this.snackbar = true, this.$router.push('/'))
        }
    }
})
</script>