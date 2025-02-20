// import Vue from 'vue';
import axios from "axios";


export async function updateBranchSettings(modalID, updatedData) {
    await axios.put(`/branches/${modalID}`, updatedData, {
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    }).then((result) => {
        // console.log(result, "result from first api")
        this.isLoading = false;
        if (result && result.status === 200) {
            makeToast(
                "success",
                "time slots updated",
                "the new time slots are updated"
            );
        }
    })
        .catch((error) => {
            // console.log(error, "from component");
            this.isLoading = false;
            let errors = error.response.data.errors;
            Object.keys(errors).forEach((key) => {
                let errorMessages = errors[key];

                errorMessages.forEach((message) => {
                    // console.log(`${key}: ${message}`);
                    makeToast("danger", "Invalid Time slot", `${key}: ${message}`);
                });
            });

        });

}

export function makeToast(variant = null, title, msg) {
    this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true,
    });
}