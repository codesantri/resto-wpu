// CREATE INITIAL
export const INITIAL_USER = {
    email: '',
    password: '',
    name:'',
    role: '',
    avatar_url:''
}

export const STATE_USER = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        name: [],
        role: [],
        avatar_url: [],
        _form:[],
    }
}

export const ROLE_LIST = [
    {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'user',
    label: 'User',
  },
  {
    value: 'cashier',
    label: 'Cashier',
  },
]


