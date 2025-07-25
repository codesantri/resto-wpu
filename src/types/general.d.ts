import { string } from "zod";

export type formState = {
    errors?:{
        _form?: string[];
    };
    status?: string;
}