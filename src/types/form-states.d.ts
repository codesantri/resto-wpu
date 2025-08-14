export type UserFormState = {
    status?: string;
    errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
        role?: string[];
        avatar_url?: string[];
        _form?: string[];
    };
};

export type MenuFormState = {
    status?: string;
    errors?: {
        id?: string[];
        name?: string[];
        category?: string[];
        price?: string[];
        discount?: string[];
        description?: string[];
        is_available?: string[];
        image_url?: string[];
        _form?: string[];
    };
};

export type TableFormState = {
    status?: string;
    errors?: {
        id?: string[];
        name?: string[];
        description?: string[];
        capacity?: string[];
        status?: string[];
        _form?: string[];
    };
};

export type OrderFormState = {
    status?: string;
    errors?: {
        customer_name?: string[];
        table_id?: string[];
        status?: string[];
        _form?: string[];
    };  
};