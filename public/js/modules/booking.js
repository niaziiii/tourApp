import axios from "axios"
import { alertMsg } from "./alertMsg"
const stripe = Stripe('pk_test_51L7dEZEaafq1Es3KVjGBwWiAY9Yip1WCw0g5MgEdFcwJAZkpLQ7q8GO3wSLf5oVIUxzcvXcf0fBAEl1vFMWIMqd200SQm1e1DR');


export const book = async (id) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `http://127.0.0.1:3000/api/v1/bookings/check-out-session/${id}`
        })

        const { data } = res



        if (data.status === 'success') {
               await stripe.redirectToCheckout(
                {
                    sessionId : res.data.session.id
                }
               )
            }
        }

     catch (error) {
        console.log(error);
        if (error.response.data.message) alertMsg('fail', error.response.data.message)
        if (error.response.message) alertMsg('fail', error.response.message)
    }
}