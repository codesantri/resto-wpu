import { STATE_ORDER } from "./order-constant";

export const IS_GENERATE_PAYMENT = {
    ...STATE_ORDER,
    data: {
        payment_token:''
    }
}