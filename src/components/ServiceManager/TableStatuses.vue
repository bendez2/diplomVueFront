<template>
  <div>
    <v-dialog width="auto" v-model="toAppointDialog">
      <v-card width="400px">
        <v-col>
          <p style="margin: 21px;" color="blue" class="text-h5 text-center">Назначение исполнителя</p>
          <v-autocomplete v-model="application.employee_id" :items="employeesApp" item-value="id" item-title="name"
            label="Исполнитель" variant="outlined"></v-autocomplete>
          <v-row>
            <v-col class="text-center">
              <v-btn class="ma-2" color="blue" outlined @click="acceptApp()">Сохранить</v-btn>
              <v-btn class="ma-2" color="blue" outlined @click="toAppointDialog = false">Отмена</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>

    <v-col>
      <VDataTable :group-by="groupBy" :loading="loading" style="font-size: 12px" loading-text="Loading... Please wait"
        :headers="headers" show-expand :items="allApp" item-value="name" class="elevation-2" :search="search">

        <template v-slot:item.statusName="{ item }">
          <v-chip :color="getColor(item.raw.status_id)">
            {{ item.raw.statusName }}
          </v-chip>
        </template>

        <template v-slot:top>
          <v-spacer></v-spacer>
          <v-row>
            <v-spacer></v-spacer>
            <v-col>
              <v-text-field v-model="search" label="Поиск" style="margin: 4px;"></v-text-field>
            </v-col>
          </v-row>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length">
              <Applications :application="item.raw" :initiatorsApp="this.initiatorsApp" :statusesApp="statusesApp"
                :typesApp="typesApp" :nameApps="nameApps" :priorityApps="priorityApps" :employeesApp="employeesApp">
              </Applications>
            </td>
          </tr>
        </template>

        <template v-slot:item.appoint="{ item }">
          <v-btn v-if="item.raw.status_id != 2 && item.raw.status_id != 3" color="green" @click="toAppoint(item.raw)">
            Назначить
          </v-btn>
        </template>
      </VDataTable>
    </v-col>
  </div>
</template>

<script>
import Applications from './Application.vue'
import API from '../../assets/api.js'

export default {
  name: "Оператор первой линии",
  components: {
    Applications,
  },
  mounted() {
    this.getApplications(),
      this.getStatusApp(), this.getNameApp(), this.getPriorityApp(), this.getTypeApp(), this.getInititorsApp(), this.getEmployeesApp();
  },
  data() {
    return {
      csvDialog: false,
      jsonDialog: false,
      loading: true,
      api: process.env.VUE_APP_ENV_API,
      toAppointDialog: false,
      application: null,
      search: null,
      reportDialog: false,
      report: {},

      allApp: [],
      initiatorsApp: [],
      statusesApp: [],
      typesApp: [],
      employeesApp: [],
      nameApps: [],
      priorityApps: [],

      groupBy: [{ key: 'statusName', order: 'asc' }],
      headers: [
        {
          title: 'Номер заявки',
          align: 'center',
          sortable: false,
          key: 'id',
        },
        { title: 'Тип заявки', align: 'center', key: 'nameApplication' },
        { title: 'Текст заявки', align: 'center', key: 'text' },
        { title: 'Приоритет', align: 'center', key: 'namePriority' },
        { title: 'Время выполнения согласно SLA', align: 'center', key: 'sla' },
        {
          title: 'Статус', align: 'center', key: 'statusName'
        },
        {
          title: 'Исполнитель', align: 'center', key: 'employeeName'
        },
        { title: '', align: 'center', sortable: false, key: 'appoint' },

      ],

    }
  },
  methods: {
    getColor(status) {
      console.log(status)
      if (status === 1 || status === 3 || status === 7) { return 'green' }
      else if (status === 5) return 'red'
      else return 'orange'
    },
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
        .then(response => (this.statusesApp = response.data.data
        ));
    },
    getInititorsApp() {
      API.get(this.api + "api/auth/users/initiators")
        .then(response => (this.initiatorsApp = response.data.data));
    },
    getEmployeesApp() {
      API.get(this.api + "api/auth/users/employees")
        .then(response => (this.employeesApp = response.data.data, console.log(this.employeesApp)));
    },
    getApplications() {
      this.loading = true;
      API.get(this.api + "api/auth/applications")
        .then(response => (this.allApp = response.data, this.loading = false));
    },
    toAppoint(item) {
      this.application = item;
      this.toAppointDialog = true;
    },
    acceptApp() {
      API.put(this.api + "api/auth/applications/accept", this.application).then(response => {
        if (response.status === 200) {
          this.getApplications();
        }
      })
    }
  }
}
</script>

<style scoped></style>