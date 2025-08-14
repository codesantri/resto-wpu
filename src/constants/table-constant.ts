import { TableForm } from "@/validations/table-validation";

export const INITIAL_TABLE: TableForm = {
    name: '',
    description: '',
    capacity: 0,
    status: 'available',
}


export const STATE_TABLE = {
    status: 'idle',
    errors: {
        name: [],
        description: [],
        capacity: [],
        status: [],
        _form:[],
    }
}


export const STATUS = [
  {
    value: 'available',
    label: 'Available',
  },
  {
    value: 'unavailable',
    label: 'Occupied',
  },
  {
    value: 'reserved',
    label: 'Reserved',
  }
];
