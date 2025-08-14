import { OrderForm } from "@/validations/order-validation";

export const INITIAL_ORDER: OrderForm = {
    customer_name: '',
    table_id: '',
    status: '',
}


export const STATE_ORDER = {
    status: 'idle',
    errors: {
        customer_name: [],
        table_id: [],
        status: [],
        _form:[],
    }
}


export const STATUS_ORDER = [
  {
    value: 'process',
    label: 'Process',
  },
  {
    value: 'reserved',
    label: 'Reserved',
  }
];
