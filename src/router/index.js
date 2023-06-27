import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import App from '../App.vue'
import ApplicationsFirst from '../components/OperatorFirstLine/TableOperator.vue'
import NewApp from '../components/OperatorFirstLine/NewApplication.vue'
import ApplicationsSecond from '../components/OperatorSecondsLine/TableOperator.vue'
import Authorization from '../components/Authorization.vue'
import ServiceManager from '../components/ServiceManager/Table.vue'
import Statuses from '../components/ServiceManager/TableStatuses.vue'
import Registration from '../components/Registration.vue'
import ApplicationsUser from '../components/User/TableUser.vue'
import NewApplcationUser from '../components/User/NewApplication.vue'

const routes = [
  {
    path: "/",
    name: "home",
    component: App,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 3) {
        next("/ApplicationsFirst")
      }
      else if (localStorage.getItem('auth') == 5) {
        next("/ApplicationsSecond");
      }
      else if (localStorage.getItem('auth') == 6) {
        next("/service");
      }
      else if (localStorage.getItem('auth') == 1) {
        next("/ApplicationsUser");
      }
      else {
        next("/auth")
      }
    }
  },
  {
    meta: { title: "Регистрация" },
    path: "/registration",
    name: "registration",
    component: Registration
  },
  {
    meta: { title: "Создание заявки" },
    path: "/newApplication",
    name: "newApplication",
    component: NewApp,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 3) {
        next()
      }
      if (localStorage.getItem('auth') == 1) {
        next('newApplicationUser')
      }
      else {
        next("/")
      }
    }
  },
  {
    meta: { title: "Создание заявки" },
    path: "/newApplicationUser",
    name: "newApplicationUser",
    component: NewApplcationUser,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 1) {
        next()
      }
      else {
        next("/")
      }
    }
  },
  {
    meta: { title: "Просмотр заявок" },
    path: "/ApplicationsUser",
    name: "applicationsUser",
    component: ApplicationsUser,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 1) {
        next()
      }
    }
  },
  {
    meta: { title: "Оператор второй линии" },
    path: "/ApplicationsSecond",
    name: "ApplicationsSecond",
    component: ApplicationsSecond,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 5) {
        next()
      }
      else {
        next("/")
      }
    }
  },
  {
    meta: { title: "Оператор первой линии" },
    path: "/ApplicationsFirst",
    name: "ApplicationsFirst",
    component: ApplicationsFirst,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 3) {
        next()
      }
      else {
        next("/")
      }
    }
  },
  {
    meta: { title: "Сервис-менеджер" },
    path: "/service",
    name: "service",
    component: ServiceManager,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 6) {
        next()
      }
      else {
        next("/")
      }
    }
  },
  {
    meta: { title: "Анализ заявок" },
    path: "/statuses",
    name: "statuses",
    component: Statuses,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('auth') == 6) {
        next()
      }
      else {
        next("/")
      }
    }
  },
  {
    meta: { title: "Авторизация" },
    path: "/auth",
    name: "auth",
    component: Authorization,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title}`;
//   next();
// })



export default router
