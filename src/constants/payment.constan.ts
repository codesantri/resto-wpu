import { IS_ACTION } from "./global-constant";

export const IS_GENERATE_PAYMENT = {
    ...IS_ACTION,
    data: {
        payment_token:''
    }
}