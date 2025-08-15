import { Menu } from "@/validations/menu-validation";
import { useMemo } from "react";

export default function usePricing(orderMenu: { menus: Menu; quantity: number }[]|null|undefined) {
    const totalPrice = useMemo(() => {
        let total = 0;
        orderMenu?.forEach((item) => {
            const price = item.menus.price * item.quantity;
            const discountPercent = Math.min(Math.max(item.menus.discount, 0), 100);
            const discountAmount = price * (discountPercent / 100);
            total += price - discountAmount;
        });
        return total;
    }, [orderMenu]);
    
    const tax = useMemo(() => Math.round(totalPrice * 0.11), [totalPrice]);

    const service = useMemo(() => Math.round(totalPrice * 0.05), [totalPrice]);

    const grandTotal = useMemo(() => totalPrice + tax + service,[totalPrice, tax, service]);

    return {totalPrice, tax, service, grandTotal};
}
