<template>
  <div>
    <v-col>
      <VDataTable style="font-size: 12px" loading-text="Loading... Please wait" :headers="headers" show-expand
        :items="allApp" item-value="name" class="elevation-2">

        <template v-slot:item.statusName="{ item }">
          <v-chip :color="getColor(item.raw.status_id)">
            {{ item.raw.statusName }}
          </v-chip>
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

        <template v-slot:item.accept="{ item }">
          <v-btn color="green" v-if="item.raw.employee_id === null && item.raw.status_id === 8"
            @click="acceptApp(item.raw)">
            Принять
          </v-btn>
          <v-btn color="green" v-if="item.raw.employee_id == userid && item.raw.status_id === 1"
            @click="completeApp(item.raw)">
            Выполнена
          </v-btn>
        </template>

        <template v-slot:item.rejection="{ item }">
          <v-btn color="red" v-if="item.raw.employee_id == userid && item.raw.status_id === 1"
            @click="rejectionApp(item.raw)">
            Отказать
          </v-btn>
        </template>
        <!-- СДЕЛАТЬ ЗАГРУЗКУ ДАННЫХ -->
      </VDataTable>
    </v-col>
  </div>
</template>

<script>
import Applications from './Application.vue'
import API from '../../assets/api.js'

export default {
  components: {
    Applications,
  },
  mounted() {
    this.userid = localStorage.getItem('userId');
    this.getApplications(),
      this.getStatusApp(), this.getNameApp(), this.getPriorityApp(), this.getTypeApp(), this.getInititorsApp(), this.getEmployeesApp();
  },
  name: "Оператор первой линии",
  data() {
    return {
      userid: null,
      loading: true,
      api: process.env.VUE_APP_ENV_API,
      allApp: [],
      initiatorsApp: [],
      statusesApp: [],
      typesApp: [],
      employeesApp: [],
      nameApps: [],
      priorityApps: [],
      headers: [
        {
          title: 'Номер заявки',
          align: 'start',
          sortable: false,
          key: 'id',
        },
        { title: 'Дата время формирования заявки', key: 'created_at' },
        { title: 'Тип заявки', key: 'nameApplication' },
        { title: 'Текст заявки', key: 'text' },
        { title: 'Место оказания услуги', key: 'location' },
        { title: 'Приоритет', key: 'namePriority' },
        { title: 'Время выполнения согласно SLA', key: 'sla' },
        { title: 'Дата время изменения статуса', key: 'updated_at' },
        { title: 'Комментарий исполнителя', key: 'comment' },
        { title: 'Дата время закрытия заявки', key: 'closetime' },
        { title: 'История исполнителей', key: 'historyExecutor' },
        { title: 'Инициатор', key: 'initiatorName' },
        {
          title: 'Статус', align: 'center', key: 'statusName'
        },
        { title: '', align: 'center', sortable: false, key: 'accept' },
        { title: '', align: 'center', sortable: false, key: 'rejection' }

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
      API.get(this.api + "api/auth/applications/inJob/" + this.userid)

        .then(response => (this.allApp = response.data, this.loading = true));
    },
    acceptApp(item) {
      item.employee_id = this.userid;
      API.put(this.api + "api/auth/applications/accept", item).then(response => {
        if (response.status === 200) {
          this.getApplications();
        }
      })
    },
    rejectionApp(item) {
      API.put(this.api + "api/auth/applications/rejection", item).then(response => {
        if (response.status === 200) {
          this.getApplications();
        }
      })
    },
    completeApp(item) {
      API.put(this.api + "api/auth/applications/complete", item).then(response => {
        if (response.status === 200) {
          this.getApplications();
        }
      })
    },

  }
}
</script>

<style scoped></style>