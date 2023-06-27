<template>
  <div>
    <v-snackbar v-model="snackbar">
      Заявка успешно создана
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-card color="" style="margin: 15px">
      <v-col>
        <p bg-color="blue" style="font-size: 24px; margin: 0px 0px 10px 20px">
          Формирование новой заявки от {{ new Date().toLocaleDateString() }}
        </p>

        <v-row style="margin: 10px 0px">
          <v-spacer></v-spacer>
          <v-btn @click="pushNewApplication()" color="blue" outlined>Отправить в работу</v-btn>
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
                  <v-autocomplete readonly v-model="newApplication.initiator_id" :items="initiatorsApp" item-value="id"
                    item-title="name" label="Инициатор" variant="outlined"></v-autocomplete>
                  <v-text-field v-model="newApplication.location" label="Место оказания услуги" variant="outlined"
                    append-inner-icon="mdi-map-marker"></v-text-field>
                </v-col>
                <v-col>
                  <v-autocomplete readonly v-model="newApplication.status_id" :items="statusesApp" item-value="id"
                    item-title="name" label="Статус заявки" variant="outlined"></v-autocomplete>
                  <v-autocomplete readonly v-model="newApplication.employee_id" :items="statusesApp" item-value="id"
                    item-title="name" label="Исполнитель" variant="outlined"></v-autocomplete>
                </v-col>
              </v-row>

              <v-textarea name="input-7-1" variant="filled" label="Текст заявки" auto-grow
                v-model="newApplication.text"></v-textarea>
              <v-textarea readonly name="input-7-1" variant="filled" label="История исполнителей" auto-grow
                v-model="newApplication.historyexecutor"></v-textarea>
              <v-text-field readonly variant="underlined" label="Комментарии исполнителя"></v-text-field>
            </v-window-item>

            <v-window-item value="two">
              <v-col>
                <v-row>
                  <v-col>
                    <v-autocomplete readonly learable v-model="nameTypeApp" label="Тип" item-title="name" item-value="id"
                      :items="nameApps" variant="outlined"></v-autocomplete>
                  </v-col>
                  <v-col>
                    <v-autocomplete readonly learable v-model="priorityTypeApp" label="Приоритет" item-title="name"
                      item-value="id" :items="priorityApps" variant="outlined"></v-autocomplete>
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
      newApplication: {},

      initiatorsApp: [],
      statusesApp: [],
      typesApp: [],
      nameApps: [],
      priorityApps: [],
      application: {},

      api: process.env.VUE_APP_ENV_API,
      tab: null,
    }
  },
  created() {
    this.getStatusApp(), this.getNameApp(), this.getPriorityApp(), this.getTypeApp(), this.getInititorsApp();
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
    getNameApp() {
      API.get(this.api + "api/auth/nameapplications")
        .then(response => (this.nameApps = response.data.data));

    },
    getPriorityApp() {
      API.get(this.api + "api/auth/priorities")
        .then(response => (this.priorityApps = response.data.data));

    },
    getTypeApp() {
      API.get(this.api + "api/auth/typeapplications")
        .then(response => (this.typesApp = response.data.data));

    },
    getStatusApp() {
      API.get(this.api + "api/auth/statuses")
        .then(response => (this.statusesApp = response.data.data, this.newApplication.status_id = 6
        ));

    },
    getInititorsApp() {
      API.get(this.api + "api/auth/users/initiators")
        .then(response => (this.initiatorsApp = response.data.data, this.newApplication.initiator_id = parseInt(localStorage.getItem('userId'))));

    },
    searchTypeApp() {
      if (this.nameTypeApp != null && this.priorityTypeApp != null) {
        this.typeApp = this.typesApp.filter(c => c.nameapplications_id == this.nameTypeApp && c.priorities_id == this.priorityTypeApp)[0];
        this.newApplication.type_id = this.typeApp.id;
        console.log(this.newApplication);
        this.newApplication.status_id = 8;
      }
    },
    pushNewApplication() {
      API.post(this.api + "api/auth/applications", this.newApplication)
        .then(response => (console.log(response)))
        .finally(this.snackbar = true, this.$router.push("/"));
    }
  }
})
</script>