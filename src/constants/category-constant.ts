import { CategoryForm } from "@/validations/category-validation";

export const INITIAL_CATEGORY: CategoryForm = {
    name: '',
}


export const STATE_CATEGORY = {
    status: 'idle',
    errors: {
        name: [],
        _form:[],
    }
}
