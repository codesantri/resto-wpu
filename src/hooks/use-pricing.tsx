import { Menu } from "@/validations/menu-validation";
import { useMemo } from "react";

export default function usePricing(
  orderMenu: { menus: Menu; quantity: number }[] | null | undefined
) {
  const { subtotal, discountTotal, discountSum, totalPrice } = useMemo(() => {
    let subtotal = 0;       // total sebelum diskon
    let discountTotal = 0;  // total nominal diskon (rupiah)
    let discountSum = 0;    // total persen diskon (penjumlahan langsung)
    let total = 0;          

    orderMenu?.forEach((item) => {
      const price = item.menus.price * item.quantity;
      const discountPercent = Math.min(Math.max(item.menus.discount, 0), 100);
      const discountAmount = price * (discountPercent / 100);

      subtotal += price;
      discountTotal += discountAmount;
      discountSum += discountPercent; // jumlahkan persentase
      total += price - discountAmount;
    });

    return { subtotal, discountTotal, discountSum, totalPrice: total };
  }, [orderMenu]);

  // Pajak 11%
  const tax = useMemo(() => Math.round(totalPrice * 0.11), [totalPrice]);

  // Service charge 5%
  const service = useMemo(() => Math.round(totalPrice * 0.05), [totalPrice]);

  // Grand total = setelah diskon + pajak + service
  const grandTotal = useMemo(
    () => totalPrice + tax + service,
    [totalPrice, tax, service]
  );

  return { subtotal, discountTotal, discountSum, totalPrice, tax, service, grandTotal };
}
