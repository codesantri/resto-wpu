// CREATE INITIAL
export const ICREATE_USER = {
    email: '',
    password: '',
    name:'',
    role: '',
    avatar_url:''
    
}

export const IS_CREATE_USER = {
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

export const IS_UPDATE_USER = {
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
        label:'Admin',
    },
    {
        value: 'user',
        label:'User',
    },
    {
        value: 'chasier',
        label:'Chasier',
    }
]


