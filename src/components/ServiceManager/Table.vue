<template>
  <div>
    <!-- диалоговое окно формирования отчета -->
    <v-dialog width="auto" v-model="reportDialog">
      <v-card width="400px">
        <v-card>
          <v-toolbar color="blue" title="Формирование отчета"></v-toolbar>
          <v-col style="padding: 10px;">
            <v-text-field variant="outlined" v-model="report.startDate" type="date" label="Начальная дата"></v-text-field>
            <v-text-field variant="outlined" v-model="report.endDate" type="date" label="Конечная дата"></v-text-field>
          </v-col>
          <v-card-actions class="justify-center">
            <v-btn variant="text" color="blue" outlined @click="createReport()">Сформировать</v-btn>
            <v-btn variant="text" color="blue" outlined @click="reportDialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <!-- диалоговое окно формирования экспорта в JSON'e -->
    <v-dialog width="auto" v-model="jsonDialog">
      <v-card width="400px">
        <v-card>
          <v-toolbar color="blue" title="Выгрузка в формате JSON"></v-toolbar>
          <v-col style="padding: 10px;">
            <v-text-field variant="outlined" v-model="report.startDate" type="date" label="Начальная дата"></v-text-field>
            <v-text-field variant="outlined" v-model="report.endDate" type="date" label="Конечная дата"></v-text-field>
          </v-col>
          <v-card-actions class="justify-center">
            <v-btn variant="text" color="blue" outlined @click="createExportJson()">Сформировать</v-btn>
            <v-btn variant="text" color="blue" outlined @click="reportDialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <!-- диалоговое окно формирования экспорта в CSV -->
    <v-dialog width="auto" v-model="csvDialog">
      <v-card width="400px">
        <v-card>
          <v-toolbar color="blue" title="Выгрузка в формате CSV"></v-toolbar>
          <v-col style="padding: 10px;">
            <v-text-field variant="outlined" v-model="report.startDate" type="date" label="Начальная дата"></v-text-field>
            <v-text-field variant="outlined" v-model="report.endDate" type="date" label="Конечная дата"></v-text-field>
          </v-col>
          <v-card-actions class="justify-center">
            <v-btn variant="text" color="blue" outlined @click="createExportCSV()">Сформировать</v-btn>
            <v-btn variant="text" color="blue" outlined @click="csvDialog = false">Закрыть</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <v-col>
      <VDataTable :loading="loading" style="font-size: 12px" loading-text="Loading... Please wait" :headers="headers"
        show-expand :items="allApp" item-value="name" class="elevation-2" :search="search">

        <template v-slot:item.statusName="{ item }">
          <v-chip :color="getColor(item.raw.status_id)">
            {{ item.raw.statusName }}
          </v-chip>
        </template>

        <template v-slot:top>
          <v-spacer></v-spacer>
          <v-row>
            <v-col>
              <v-btn class="ma-2" color="blue" outlined @click="this.csvDialog = true">Выгрузка заявок (CSV)</v-btn>
              <v-btn class="ma-2" color="blue" outlined @click="this.jsonDialog = true">Выгрузка заявок (JSON)</v-btn>
              <v-btn class="ma-2" color="blue" outlined @click="this.reportDialog = true">Отчет</v-btn>
            </v-col>
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
      </VDataTable>
    </v-col>
  </div>
</template>

<script>
import Applications from './Application.vue'
import API from '../../assets/api.js'
import axios from 'axios';

export default {
  name: "Оператор первой линии",
  components: {
    Applications,
  },
  mounted() {
    this.userid = localStorage.getItem('userId');
    this.getApplications(),
      this.getStatusApp(), this.getNameApp(), this.getPriorityApp(), this.getTypeApp(), this.getInititorsApp(), this.getEmployeesApp();
  },
  data() {
    return {
      csvDialog: false,
      jsonDialog: false,
      userid: null,
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
        { title: '', align: 'center', sortable: false, key: 'appoint' },

      ],

    }
  },
  methods: {
    createReport() {
      var a = this.report;
      axios.post(this.api + "api/auth/applications/report", a, {
        requestType: 'application/json',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        responseType: 'blob',
      }).then(function (response) {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement('a');

        anchorElement.href = href;
        anchorElement.download = 'отчет.docx';

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        this.reportDialog = false;
      })
    },
    createExportJson() {
      var a = this.report;
      axios.post(this.api + "api/auth/applications/exportJson", a, {
        requestType: 'application/json',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        responseType: 'blob',
      }).then(function (response) {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement('a');

        anchorElement.href = href;
        anchorElement.download = 'экспорт JSON.json';

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        this.jsonDialog = false;
      })
    },
    getColor(status) {
      console.log(status)
      if (status === 1 || status === 3 || status === 7) { return 'green' }
      else if (status === 5) return 'red'
      else return 'orange'
    },
    createExportCSV() {
      var a = this.report;
      axios.post(this.api + "api/auth/applications/csvGET", a, {
        requestType: 'application/json',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        responseType: 'blob',
      }).then(function (response) {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement('a');

        anchorElement.href = href;
        anchorElement.download = 'экспорт за' + new Date().toLocaleString() + ' .csv';

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
        this.csvDialog = false;
      })
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
  }
}
</script>

<style scoped></style>