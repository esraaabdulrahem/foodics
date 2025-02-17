<template>
  <div id="app">
    <ReservationsList />
  </div>
</template>

<script>
import ReservationsList from "../src/views/reservationList/ReservationsList.vue";

export default {
  name: "App",
  components: {
    ReservationsList,
  },

};
</script>
