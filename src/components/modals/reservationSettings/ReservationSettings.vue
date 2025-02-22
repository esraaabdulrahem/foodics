<template>
  <div class="reservation-settings">
    <div class="generic-modal">
      <b-button
        v-b-modal="`modal-${modalID}`"
        class="generic-modal__show-popup-btn"
        @click="getTables(modalID)"
      >
        {{ branchName }}
      </b-button>
      <b-modal
        :id="`modal-${modalID}`"
        :title="`Edit ${branchName} branch reservation setting`"
        ok-title="save"
        cancel-title="close"
        @ok="handleSave"
      >
        <GenericLoader v-if="isLoading" />

        <form class="modal-body__form" @submit.stop.prevent="handleSubmit">
          <div class="modal-body__input-field">
            <p class="modal-body__title-field">Reservation Duration (minutes)*</p>
            <b-form-input
              v-model="formData.reservation_duration"
              placeholder="Enter Duration"
            ></b-form-input>
            <p class="modal-body__errors" v-for="error of v$.$errors" :key="error.$uid">
              {{ error.$message }}
            </p>
          </div>
          <p class="modal-body__title-field">Tables</p>
          <v-select multiple v-model="selectedTables" :options="tablesNames" />
          <div
            v-if="
              (reservationTimes != null || reservationTimes != []) &&
              tablesNames.length != 0
            "
          >
            <div v-for="(times, day) in reservationTimes" :key="day">
              <label class="modal-body__title-field"
                >{{ day.charAt(0).toUpperCase() + day.slice(1) }}
              </label>
              <div v-if="times.length > 0">
                <div
                  class="d-flex justify-content-between"
                  v-for="(timeRange, index) in times"
                  :key="index"
                >
                  <span>
                    <strong>
                      Reserved time : {{ timeRange[0] }} - {{ timeRange[1] }}
                    </strong>
                  </span>
                  <button
                    class="generic-transparent-btn"
                    @click="cancelReservation(times, timeRange, day)"
                    type="button"
                  >
                    Cancel Reservation
                  </button>
                </div>
              </div>
              <section>
                <label class="modal-body__title-field"> from: </label>
                <b-form-timepicker
                  :id="`add-${day}-from`"
                  v-model="newReservation[day].from"
                  now-button
                  reset-button
                  :hour12="false"
                  :disabled="times.length > 2"
                  placeholder="Choose a time"
                  @hidden="
                    addEditTimeSlots(
                      newReservation[day].from,
                      `add-${day}-from`,
                      day,
                      true,
                      times
                    )
                  "
                >
                </b-form-timepicker>

                <label class="modal-body__title-field"> to: </label>
                <b-form-timepicker
                  :id="`add-${day}-to`"
                  v-model="newReservation[day].to"
                  now-button
                  reset-button
                  :hour12="false"
                  :disabled="!newReservation[day].from"
                  placeholder="Choose a time"
                  @hidden="
                    addEditTimeSlots(
                      newReservation[day].to,
                      `add-${day}-to`,
                      day,
                      true,
                      times
                    )
                  "
                >
                </b-form-timepicker>
                <p v-if="newReservation[day].showError" class="modal-body__errors">
                  {{ slotsError }}
                </p>
              </section>
            </div>
          </div>
          <div v-if="reservationTimes === null && tablesNames.length != 0">
            <section v-for="(reservation, day) in newReservation" :key="day">
              <label :for="day"> {{ day.charAt(0).toUpperCase() + day.slice(1) }}</label>
              <label class="modal-body__title-field"> from: </label>
              <b-form-timepicker
                :id="`add-${day}-from`"
                v-model="reservation.from"
                :disabled="reservation.from != ''"
                now-button
                reset-button
                :hour12="false"
                placeholder="Choose a time"
                @hidden="
                  addEditTimeSlots(reservation.from, `add-${day}-from`, day, false)
                "
              >
              </b-form-timepicker>

              <label class="modal-body__title-field"> to: </label>
              <b-form-timepicker
                :id="`add-${day}-to`"
                v-model="reservation.to"
                now-button
                reset-button
                :hour12="false"
                :disabled="reservation.from === ''"
                placeholder="Choose a time"
                @hidden="addEditTimeSlots(reservation.to, `add-${day}-to`, day, false)"
              >
              </b-form-timepicker>
              <p v-if="reservation.showError" class="modal-body__errors">
                {{ slotsError }}
              </p>
            </section>
          </div>
        </form>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import vSelect from "vue-select";
import { BButton, BModal, VBModal, BFormInput } from "bootstrap-vue";
import "vue-select/dist/vue-select.css";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, between } from "@vuelidate/validators";
// import { updateBranchSettings } from "./services";
import GenericLoader from "../../genericLoader/GenericLoader.vue";

export default {
  data() {
    return {
      selectedTables: "",
      tablesNames: [],
      isLoading: false,
      newReservation: {
        saturday: { from: "", to: "", showError: false },
        sunday: { from: "", to: "", showError: false },
        monday: { from: "", to: "", showError: false },
        tuesday: { from: "", to: "", showError: false },
        wednesday: { from: "", to: "", showError: false },
        thursday: { from: "", to: "", showError: false },
        friday: { from: "", to: "", showError: false },
      },
      editReservationFrom: "",
      editReservationTo: "",
      slotsError: "you can not add more than 3 time slots per day",
      slotsArray: [],
      formData: {
        reservation_duration: this.reservationDuration,
        reservation_times: {
          saturday: [],
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        },
      },
    };
  },
  components: {
    BButton,
    BModal,
    BFormInput,
    vSelect,
    GenericLoader,
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      formData: {
        reservation_duration: {
          required,
          numeric,
          $autoDirty: true,
          between: between(30, 120),
        },
      },
    };
  },
  props: [
    "reservationList",
    "branchName",
    "modalID",
    "reservationTimes",
    "reservationDuration",
  ],

  directives: {
    "b-modal": VBModal,
  },
  methods: {
    handleSave() {
      this.handleSubmit();
    },
    async handleSubmit() {
      this.v$.$touch();
      if (this.v$.$errors.length === 0) {
        this.isLoading = true;
        this.updateBranchSettings(this.modalID, this.formData);
      }
    },
    getTables(ID) {
      //need to be enhanced
      // this.reservationList.forEach((section) => {
      //   if (section.sections.length != 0) {
      //     section.sections.forEach((sectionName) => {
      //       if (sectionName.tables.length != 0) {
      //         sectionName.tables.forEach((table) => {
      //           if (table.name != "") {
      //             let tableObj = {
      //               label: `${sectionName.name} - ${table.name}`,
      //               id: table.id,
      //             };
      //             this.tablesNames.push(tableObj);
      //           }
      //         });
      //       }
      //     });
      //   }
      // });

      //there are a lot of cases why we can open the popup as there is no tables to be reserved
      //and why we can render the record when only it accept the reservation to be true and there is no available
      // tables i choose to not render the reservation time slots of days when there is no avaliable tables unless we
      //can add tables or rather than that I will render tables for all reords
      // I also want to not render the record in table unless it has sections !=[]
      this.reservationList.filter((list) => {
        if (list.id === ID && list.sections.length != 0)
          list.sections.forEach((sectionName) => {
            if (sectionName.tables.length != 0) {
              sectionName.tables.forEach((table) => {
                if (table.name != "") {
                  let tableObj = {
                    label: `${sectionName.name} - ${table.name}`,
                    id: `${sectionName.id}_${table.id}`,
                  };
                  this.tablesNames.push(tableObj);
                }
              });
            }
          });
      });
    },
    async updateBranchSettings(ID, data) {
      await axios
        .put(`/branches/${ID}`, data, {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        })
        .then((result) => {
          this.isLoading = false;
          if (result && result.status === 200) {
            this.makeToast(
              "success",
              "time slots updated",
              "the new time slots are updated"
            );
            this.$emit("branchDataUpdated");
          }
        })
        .catch((error) => {
          this.isLoading = false;
          let errors = error.response.data.errors;
          Object.keys(errors).forEach((key) => {
            let errorMessages = errors[key];

            errorMessages.forEach((message) => {
              this.makeToast("danger", "Invalid Time slot", `${key}: ${message}`);
            });
          });

          this.slotsArray = [];
        });
    },
    addEditTimeSlots(value, ID, dayName, editFlag, times) {
      let day = this.formData.reservation_times[dayName];

      if ((ID === `add-${dayName}-from` || ID === `add-${dayName}-to`) && value != "") {
        if (day.length < 3) {
          if (this.slotsArray.length < 2) {
            this.slotsArray.push(value.slice(0, -3));
            if (this.slotsArray.length === 2) {
              day.push(this.slotsArray);
              times.push(this.slotsArray);
              this.makeToast(
                "success",
                "time added",
                `first time slot is reserved from ${this.slotsArray[0]} to ${this.slotsArray[1]} click save to keep reservations`
              );
              this.slotsArray = [];
              this.newReservation[dayName].from = "";
              this.newReservation[dayName].to = "";
              if (editFlag) {
                let newUpdatedArray = this.compareAndUpdateArrays(times, day);
                day = newUpdatedArray;
                this.formData.reservation_times[dayName] = newUpdatedArray;
                this.slotsArray = [];
                this.newReservation[dayName].from = "";
                this.newReservation[dayName].to = "";
                return newUpdatedArray;
              }
            }
            this.makeToast(
              "success",
              "time added",
              "first time slot is added please add the end time slot in the to section"
            );
            this.makeToast(
              "info",
              "quick info",
              " you can add up to 3 time slots for the same day"
            );
          } else {
            day.push(this.slotsArray);
            this.slotsArray = [];
          }
        } else {
          this.newReservation[dayName].showError = true;
        }
      }
    },
    compareAndUpdateArrays(array1, array2) {
      let NewUnrepeatedVals = [...array2];

      array1.forEach((slot1) => {
        const slotExistsInArray2 = array2.some((slot2) =>
          this.areSlotsEqual(slot1, slot2)
        );
        if (!slotExistsInArray2) {
          NewUnrepeatedVals.push(slot1);
        }
      });

      return NewUnrepeatedVals;
    },
    areSlotsEqual(slot1, slot2) {
      if (slot1.length !== slot2.length) {
        return false;
      }

      for (let i = 0; i < slot1.length; i++) {
        if (slot1[i] !== slot2[i]) {
          return false;
        }
      }
      return true;
    },
    cancelReservation(reservedSpots, cancelledSlot, day) {
      let updatedSlots = reservedSpots.filter(
        (slot) => !(slot[0] === cancelledSlot[0] && slot[1] === cancelledSlot[1])
      );
      reservedSpots = updatedSlots;
      this.formData.reservation_times[day] = reservedSpots;
      this.isLoading = true;
      this.updateBranchSettings(this.modalID, this.formData);
    },
    makeToast(variant = null, title, msg) {
      this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true,
      });
    },
  },
};
</script>
