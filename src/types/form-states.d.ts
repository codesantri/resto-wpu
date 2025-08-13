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