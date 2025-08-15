import { MenuForm } from "@/validations/menu-validation";

export const INITIAL_MENU:MenuForm = {
 name: "",
  category_id: "",
  price: 0,
  discount: 0,
  is_available: true,
  image_url: '',
  description: '',
}

export const STATE_MENU = {
  status: 'idle',
  errors: {
    name: [],
    category_id: [],
    price: [],
    discount: [],
    is_available: [],
    image_url: [],
    description: [],
    _form: [],
  }
};


export const CATEGORIES = [
  {
    value: 'coffee',
    label: 'Coffee',
  },
  {
    value: 'tea',
    label: 'Tea',
  },
  {
    value: 'non_coffee',
    label: 'Non Coffee',
  },
  {
    value: 'pastry',
    label: 'Pastry',
  },
  {
    value: 'dessert',
    label: 'Dessert',
  },
  {
    value: 'main_course',
    label: 'Main Course',
  },
  {
    value: 'appetizer',
    label: 'Appetizer',
  },
  {
    value: 'beverage',
    label: 'Beverage',
  },
];
