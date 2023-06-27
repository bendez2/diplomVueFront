<template>
  <v-app>
    <v-main>
      <HeaderView :key="$route"></HeaderView>
      <TopButtons :key="$route"></TopButtons>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import HeaderView from './components/HeaderView.vue'
import TopButtons from './components/TopButtons.vue'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  components: {
    HeaderView,
    TopButtons,
  },
}
</script>

<style></style>
