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
    this.getApplications(),
      this.getStatusApp(), this.getNameApp(), this.getPriorityApp(), this.getTypeApp(), this.getInititorsApp(), this.getEmployeesApp();
  },
  name: "Оператор первой линии",
  data() {
    return {
      loading: true,
      api: process.env.VUE_APP_ENV_API,
      allApp: [],
      initiatorsApp: [],
      statusesApp: [],
      typesApp: [],
      nameApps: [],
      employeesApp: [],
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
        { title: '', sortable: false, key: 'delete' }

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

        .then(response => (console.log(response), this.allApp = response.data, this.loading = true));
    },
    deleteItem(item) {
      console.log(item);
      API.delete(this.api + "api/auth/applications/" + item.id).then(response => {
        if (response.status === 200) {
          this.getApplications();
        }
      })
    },

  }
}
</script>

<style scoped></style>