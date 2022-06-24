import axios from "axios"
import {alertMsg} from "./alertMsg"

export const loginUser = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/user/login',
      data: {
        email,
        password
      }
    })

    const { data } = res
    if (data.status === 'success') { 
      alertMsg('success', 'Successfuly Logged In')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  }
  catch (error) {
    if (error.response.data.message) alertMsg('fail',error.response.data.message)
   if (error.response.message) alertMsg('fail',error.response.message)
  }
};
export const logoutUser = async () => {
  try {
    const res = await axios({
      method: 'Get',
      url: 'http://127.0.0.1:3000/api/v1/user/logout',
    })


    const { data } = res
    if (data.status === 'success') {
      location.reload(true)
    }
  } catch (error) {
    console.log(error);
  }
}

