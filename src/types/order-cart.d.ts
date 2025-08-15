import { Menu } from "@/validations/menu-validation";

export type Cart = {
    menu_id: string;
    quantity: number;
    total: number;
    notes: string;
    menu: Menu;
    order_id?: string;
}