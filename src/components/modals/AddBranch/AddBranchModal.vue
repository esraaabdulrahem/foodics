<template>
  <div class="generic-modal">
    <b-button v-b-modal.modal-1 class="generic-modal__show-popup-btn" @click="getBarnches">Add Branch</b-button>

    <b-modal id="modal-1" title="Add Branches" ok-title="save" cancel-title="close" @ok="handleSave">
      <p class="modal-body__title">Branches</p>
      <v-select v-model="selected" :options="branches" />
    </b-modal>
  </div>
</template>
<script>
import axios from "axios";
import Vue from "vue";
import vSelect from "vue-select";
import { BButton, BModal, VBModal } from "bootstrap-vue";
import "vue-select/dist/vue-select.css";

Vue.component("v-select", vSelect);

export default {
  data() {
    return {
      selected: "",
      branches: [],
    };
  },
  props: ["reservationList"],
  components: {
    BButton,
    BModal,
  },

  directives: {
    "b-modal": VBModal,
  },
  methods: {
    async handleSave() {
      return await axios
        .put(
          `/branches/${this.selected.id}`,
          { accepts_reservations: true, ...this.reservationList },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        )
        .then((result) => {
          console.log(result);
          this.$emit("addBranchPopupClosed", this.selected = '')
        });
    },
    getBarnches() {
      this.branches = this.reservationList.map((item) => {
        return {
          label: ` ${item.name}  Accepts Reservations: ${item.accepts_reservations ? "yes" : "no"
            } `,
          id: item.id,
          accepts_reservations: item.accepts_reservations,
        };
      });
    },
  },
};
</script>
