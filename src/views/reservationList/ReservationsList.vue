<template>
  <div class="reservation-page">
    <div class="reservation-page__header">
      <div class="container">
        <div class="reservation-page__content">
          <h1 class="reservation-page__title">Reservations</h1>
          <button class="generic-purple-btn" @click="disableTablesReservation">
            Disable Reservation
          </button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="reservation-page__list">
        <AddBranchModal
          class="reservation-page__add-branch"
          :reservationList="reservationList"
          @addBranchPopupClosed="addBranchPopupClosed($event)"
        />
        <NotFound v-if="isReservationDisabled || reservationList.length === 0" />
        <table class="table" v-else>
          <thead>
            <tr>
              <th scope="col">Branch</th>
              <th scope="col">Reference</th>
              <th scope="col">Number of Tables</th>
              <th scope="col">Reservation Duration</th>
            </tr>
          </thead>
          <GenericLoader v-if="isLoading" />
          <tbody>
            <tr v-for="(branch, index) in reservationList" :key="index">
              <td
                v-if="
                  branch.accepts_reservations &&
                  (branch.reservation_times != [] || branch.reservation_times != null)
                "
              >
                <ReservationSettings
                  v-if="
                    branch.accepts_reservations &&
                    (branch.reservation_times != [] || branch.reservation_times != null)
                  "
                  :reservationList="reservationList"
                  :branchName="branch.name"
                  :modalID="branch.id"
                  :reservationDuration="branch.reservation_duration"
                  :reservationTimes="branch.reservation_times"
                  @branchDataUpdated="branchDataUpdated"
                />
              </td>
              <td
                v-if="
                  branch.accepts_reservations &&
                  (branch.reservation_times != [] || branch.reservation_times != null)
                "
              >
                <span v-if="branch.reference">
                  {{ branch.reference }}
                </span>
                <span v-else> -- </span>
              </td>
              <td
                v-if="
                  branch.accepts_reservations &&
                  (branch.reservation_times != [] || branch.reservation_times != null)
                "
              >
                {{ branch.accepts_reservations }}
                <!-- {{ getTablesNumber(branch.sections)  }} -->
              </td>
              <td
                v-if="
                  branch.accepts_reservations &&
                  (branch.reservation_times != [] || branch.reservation_times != null)
                "
              >
                {{ branch.reservation_duration }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import accessToken from "@/accessToken";
import axios from "axios";
import GenericLoader from "../../components/genericLoader/GenericLoader.vue";
import NotFound from "@/components/notFound/NotFound.vue";
import AddBranchModal from "@/components/modals/AddBranch/AddBranchModal.vue";
import ReservationSettings from "@/components/modals/reservationSettings/ReservationSettings.vue";

export default {
  name: "ReservationsList",
  data() {
    return {
      reservationList: [],
      branches: [],
      isLoading: false,
      isReservationDisabled: false,
      tableCount: 0,
    };
  },
  components: {
    AddBranchModal,
    GenericLoader,
    NotFound,
    ReservationSettings,
  },
  methods: {
    async getBranchesListing() {
      // axios.defaults.headers.common['Authorization'] =  `Bearer ${accessToken.token}`
      let setToken = `Bearer ${accessToken.token}`;
      localStorage.setItem("token", `Bearer ${accessToken.token}`);
      return await axios
        .get("branches?include[0]=sections&include[1]=sections.tables", {
          headers: {
            Authorization: setToken,
            "Content-Type": "application/json",
          },
        })
        .then((result) => {
          if (result.status === 200) {
            this.reservationList = result.data.data;

            this.isLoading = false;
            if (
              this.reservationList.every((list) => list.accepts_reservations === false)
            ) {
              this.isReservationDisabled = true;
            }
          }
        });
    },
    mapBranches() {
      this.branches = this.reservationList.map((item) => {
        return {
          name: item.name,
          id: item.id,
        };
      });
    },
    addBranchPopupClosed() {
      this.isLoading = true;
      this.isReservationDisabled = false;
      this.getBranchesListing();
    },
    branchDataUpdated(){
      this.isLoading = true;
      this.getBranchesListing();
    },
    disableTablesReservation() {
      // would be better if we used an API but I don't know the update Api that will update all records at once
      this.reservationList.forEach((item) => {
        item.accepts_reservations = false;
        this.isReservationDisabled = true;
      });
    },
    getTablesNumber(sections) {
      sections.forEach((section) => {
        section.tables.forEach((table) => {
          if (table.accepts_reservations) {
            this.tableCount++;
          }
        });
      });
      return this.tableCount
    },
  },
  mounted() {
    this.getBranchesListing();
  },
};
</script>
