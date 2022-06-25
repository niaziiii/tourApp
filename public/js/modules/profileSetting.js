import axios from "axios"
import { alertMsg  } from "./alertMsg";
export const profileSettingSave = async (data) => {
    try {
        const res =await axios({
            method: 'PATCH',
            url: '/api/v1/user/updateMe',
            data
        })


        if (res.data.status === 'Success'|| res.data.status === 'success') {

            alertMsg('success', 'Successfuly Setting Changed!')
            window.setTimeout(() => {
                location.reload()
            }, 1500)
        }

    } catch (error) {
        if (error.response.data.message) alertMsg('fail',error.response.data.message)
        if (error.response.message) alertMsg('fail',error.response.message)

    }

}