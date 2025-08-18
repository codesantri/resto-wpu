import { IS_ACTION } from "./global-constant";

export const IS_ONLINE_PAYMENT = {
    ...IS_ACTION,
    data: {
        payment_token:''
    }
}

export const IS_CASH_PAYMENT = {
    ...IS_ACTION,
    data: {
        id:'',
        table_id:'',
        payment_method:'',
        order_id:'',
        cash: 0,
        cash_back:0,
        tax:0,
        service:0,
        total_payment: 0,
    }
}