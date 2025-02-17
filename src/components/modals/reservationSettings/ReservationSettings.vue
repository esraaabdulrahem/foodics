<template>
    <div class="reservation-settings">

        <div class="generic-modal">
            <b-button v-b-modal="`modal-${modalID}`" class="generic-modal__show-popup-btn" @click="getTables">
                {{ branchName }}
            </b-button>


            <b-modal :id="`modal-${modalID}`" :title='`Edit ${branchName} branch reservation setting`' ok-title="save"
                cancel-title="close" @ok="handleSave">

                <form class="modal-body__form" @submit.stop.prevent="handleSubmit">
                    <span class="modal-body__form__disclamer"> disclaimer: please notice that the reservation time
                        should be greater than the reservation duration </span>
                    <div class="modal-body__input-field">
                        <p class=" modal-body__title-field">Reservation Duration (minutes)*</p>
                        <b-form-input v-model="formData.reservation_duration"
                            placeholder="Enter Duration"></b-form-input>
                        <p class="modal-body__errors" v-for="error of v$.$errors" :key="error.$uid">
                            {{ error.$message }}
                        </p>
                    </div>
                    <p class="modal-body__title-field">Tables </p>
                    <v-select multiple v-model="selectedTables" :options="tablesNames" />
                    <div v-if="reservationTimes != null">
                        <div v-if="reservationTimes.saturday.length != 0">
                            <label class="modal-body__title-field">Saturday </label>
                            <b-form-timepicker :id='`saturday-${saturdayIndex}`'
                                v-for="(saturday, saturdayIndex) in reservationTimes.saturday" :key="saturdayIndex"
                                now-button reset-button :hour12="false" :value="saturday[saturdayIndex]"
                                placeholder="Choose a time">

                                {{ saturday[saturdayIndex] }}
                            </b-form-timepicker>
                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Saturday </label>
                            <b-form-timepicker id='add-saturday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div v-if="reservationTimes.sunday.length != 0" class="">
                            <label class="modal-body__title-field">Sunday </label>
                            <b-form-timepicker :id='`sunday-${sundayIndex}`'
                                v-for="(sunday, sundayIndex) in reservationTimes.sunday" :key="sundayIndex" now-button
                                reset-button :hour12="false" :value="sunday[sundayIndex]" placeholder="Choose a time">

                                {{ sunday[sundayIndex] }}
                            </b-form-timepicker>
                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Sunday </label>
                            <b-form-timepicker id='add-sunday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div class="" v-if="reservationTimes.monday.length != 0">
                            <label class="modal-body__title-field">Monday </label>
                            <b-form-timepicker :id='`monday-${mondayIndex}`'
                                v-for="(monday, mondayIndex) in reservationTimes.monday" :key="mondayIndex" now-button
                                reset-button :hour12="false" :value="monday[mondayIndex]" placeholder="Choose a time">

                                {{ monday[mondayIndex] }}
                            </b-form-timepicker>
                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Monday </label>
                            <b-form-timepicker id='add-monday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div class="" v-if="reservationTimes.tuesday.length != 0">
                            <label class="modal-body__title-field">Tuesday </label>
                            <b-form-timepicker :id='`tuesday-${tuesdayIndex}`'
                                v-for="(tuesday, tuesdayIndex) in reservationTimes.tuesday" :key="tuesdayIndex"
                                now-button reset-button :hour12="false" :value="tuesday[tuesdayIndex]"
                                placeholder="Choose a time">

                                {{ tuesday[tuesdayIndex] }}
                            </b-form-timepicker>
                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Tuesday </label>
                            <b-form-timepicker id='add-tuesday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div class="" v-if="reservationTimes.wednesday.length != 0">
                            <label class="modal-body__title-field">Wednesday </label>
                            <b-form-timepicker :id='`wednesday-${wednesdayindex}`'
                                v-for="(wednesday, wednesdayindex) in reservationTimes.wednesday" :key="wednesdayindex"
                                now-button reset-button :hour12="false" :value="wednesday[wednesdayindex]"
                                placeholder="Choose a time">

                                {{ wednesday[wednesdayindex] }}
                            </b-form-timepicker>
                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Wednesday </label>
                            <b-form-timepicker id='add-wednesday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div class="" v-if="reservationTimes.thursday.length != 0">
                            <label class="modal-body__title-field">Thursday </label>
                            <b-form-timepicker :id='`thursday-${thursdayIndex}`'
                                v-for="(thursday, thursdayIndex) in reservationTimes.thursday" :key="thursdayIndex"
                                now-button reset-button :hour12="false" :value="thursday[thursdayIndex]"
                                placeholder="Choose a time">

                                {{ thursday[thursdayIndex] }}
                            </b-form-timepicker>

                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Thursday </label>
                            <b-form-timepicker id='add-thursday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div class="" v-if="reservationTimes.friday.length != 0">
                            <label class="modal-body__title-field">Friday </label>
                            <b-form-timepicker v-for="(friday, friIndex) in reservationTimes.friday" :key="friIndex"
                                now-button reset-button :id='`friday-${friIndex}`' :hour12="false"
                                @hidden="EditTimeValues(friday[friIndex], `friday-${friIndex}`)"
                                :value="friday[friIndex]" placeholder="Choose a time">

                                {{ friday[friIndex] }}
                            </b-form-timepicker>

                        </div>
                        <div v-else>
                            <label class="modal-body__title-field">Friday </label>
                            <b-form-timepicker id='add-friday-from' v-model="newReservation" now-button reset-button
                                :hour12="false" placeholder="Choose a time"
                                @hidden="addTimeSelected(newReservation, 'add-friday')">
                            </b-form-timepicker>
                            <!-- <b-form-timepicker id='add-friday-to' v-model="newReservation" now-button reset-button
                                :hour12="false" placeholder="Choose a time"
                                @hidden="timeSelected(newReservation, 'add-friday')">
                            </b-form-timepicker> -->
                            <p v-if="showError" class="modal-body__errors">{{ slotsError }}</p>
                        </div>
                    </div>
                    <div v-else>
                        <div>
                            <label class="modal-body__title-field">Saturday </label>
                            <b-form-timepicker id='add-saturday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div>
                            <label class="modal-body__title-field">Sunday </label>
                            <b-form-timepicker id='add-sunday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div>
                            <label class="modal-body__title-field">Monday </label>
                            <b-form-timepicker id='add-monday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div>
                            <label class="modal-body__title-field">Tuesday </label>
                            <b-form-timepicker id='add-tuesday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div>
                            <label class="modal-body__title-field">Wednesday </label>
                            <b-form-timepicker id='add-wednesday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div>
                            <label class="modal-body__title-field">Thursday </label>
                            <b-form-timepicker id='add-thursday' now-button reset-button :hour12="false"
                                placeholder="Choose a time">
                            </b-form-timepicker>
                        </div>
                        <div>
                            <label class="modal-body__title-field">Friday </label>
                            <b-form-timepicker id='add-friday-from' v-model="newReservation" now-button reset-button
                                :hour12="false" placeholder="Choose a time"
                                @hidden="addTimeSelected(newReservation, 'add-friday')">
                            </b-form-timepicker>
                            <!-- <b-form-timepicker id='add-friday-to' v-model="newReservation" now-button reset-button
                                :hour12="false" placeholder="Choose a time"
                                @hidden="timeSelected(newReservation, 'add-friday')">
                            </b-form-timepicker> -->
                            <p v-if="showError" class="modal-body__errors">{{ slotsError }}</p>
                        </div>
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
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, between } from '@vuelidate/validators'

export default {
    data() {
        return {
            selectedTables: "",
            tablesNames: [],
            newReservation: '',
            slotsError: 'you can not add more than 3 time slots',
            showError: false,
            slotsArray: [],
            newVal: '',
            formData: {
                reservation_duration: this.reservationDuration,
                reservation_times: {
                    saturday: [],
                    sunday: [],
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                }
            }
        };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations() {
        return {
            formData: {
                reservation_duration: {
                    required,
                    numeric,
                    $autoDirty: true,
                    between: between(30, 120)
                },
            }
        }
    },
    props: [
        "reservationList",
        'branchName',
        "modalID",
        "reservationTimes",
        'reservationDuration'
    ],
    components: {
        BButton,
        BModal,
        BFormInput,
        vSelect,
    },

    directives: {
        "b-modal": VBModal,
    },
    methods: {
        handleSave(bvModalEvent) {
            bvModalEvent.preventDefault()
            this.handleSubmit()
        },
        async handleSubmit() {
            this.v$.$touch();
            if (this.v$.$errors.length === 0) {
                await axios
                    .put(
                        `/branches/${this.modalID}`, this.formData,
                        {
                            headers: {
                                Authorization: localStorage.getItem("token"),
                                "Content-Type": "application/json",
                            },
                        }
                    )
                    .then((result) => {
                        console.log(result);
                    });
                this.$bvModal.hide('modal-prevent-closing')
            }
        },
        getTables() {
            //need to be enhanced
            this.reservationList.forEach(section => {
                if (section.sections.length != 0) {
                    section.sections.forEach(sectionName => {
                        if (sectionName.tables.length != 0) {
                            sectionName.tables.forEach(table => {
                                if (table.name != '') {
                                    let tableObj = {
                                        label: `${sectionName.name} - ${table.name}`,
                                        id: table.id
                                    }
                                    this.tablesNames.push(tableObj)
                                }
                            })
                        }
                    })
                }
            });
        },
        addTimeSelected(value, ID) {
            //add is working but need to be enhanced "native way"
            let friday = this.formData.reservation_times.friday;
            if (ID === 'add-friday' && value != '') {
                if (friday.length < 3) {
                    if (this.slotsArray.length < 2) {
                        this.slotsArray.push(value.slice(0, -3))
                        this.makeToast("success")

                    } else {
                        friday.push(this.slotsArray)

                        this.slotsArray = []

                    }
                } else {
                    this.showError = true;

                }
            }

        },
        EditTimeValues(newVal, ID) {
            //not working 
            if (ID) {
                let friday = this.formData.reservation_times.friday;
                if (friday.length < 3) {
                    if (this.slotsArray.length < 2) {
                        this.slotsArray.push(newVal)
                        // this.slotsArray.push(value)
                    } else {
                        friday.push(this.slotsArray)
                        this.slotsArray = []
                    }
                } else {
                    this.showError = true;

                }
            }

        },
        makeToast(variant = null) {
            this.$bvToast.toast('Toast body content', {
                title: `Variant ${variant || 'default'}`,
                variant: variant,
                solid: true
            })
        }
    },
};
</script>
