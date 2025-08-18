import { Menu } from "@/validations/menu-validation";
import { useMemo } from "react";

export default function usePricing(
  orderMenu: { menus: Menu; quantity: number }[] | null | undefined
) {
  const { subtotal, discountTotal, discountSum } = useMemo(() => {
    let subtotal = 0;
    let discountTotal = 0;

    orderMenu?.forEach((item) => {
      const price = item.menus.price * item.quantity;
      const discountPercent = Math.min(Math.max(item.menus.discount, 0), 100);
      const discountAmount = price * (discountPercent / 100);

      subtotal += price;
      discountTotal += discountAmount;
    });

    // Hitung persentase diskon efektif
    const discountSum =
      subtotal > 0 ? Math.round((discountTotal / subtotal) * 100) : 0;

    return { subtotal, discountTotal, discountSum };
  }, [orderMenu]);

  // Pajak 11% dari harga setelah diskon
  const tax = useMemo(() => Math.round((subtotal - discountTotal) * 0.11), [
    subtotal,
    discountTotal,
  ]);

  // Service 5% dari harga setelah diskon
  const service = useMemo(() => Math.round((subtotal - discountTotal) * 0.05), [
    subtotal,
    discountTotal,
  ]);

  // Grand total
  const grandTotal = useMemo(
    () => subtotal - discountTotal + tax + service,
    [subtotal, discountTotal, tax, service]
  );

  return {
    subtotal,
    discountTotal,
    discountSum,
    tax,
    service,
    grandTotal,
  };
}
