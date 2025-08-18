import InputPrice from "@/components/common/price";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IDR } from "@/lib/utils";

interface Props {
  subtotal: number;
  tax: number;
  service: number;
  discountSum: number;       // % diskon
  discountTotal: number;     // nilai diskon (rupiah)
  paymentMethod: string;     // "cash" | "online"
  isSettled: boolean;        // order udah settle atau belum
  isServed: boolean |undefined|null;
  cashBack: number;
  cash: string;
  error?: string;
    handleCashInput: (value: string, rawValue: string) => void;
}

export default function MainSummary({
  subtotal,
  tax,
  service,
  discountSum,
  discountTotal,
  paymentMethod,
  isSettled,
  cashBack,
  cash,
  error,
  isServed,
  handleCashInput,
}: Props) {
  return (
    <CardContent className="space-y-4">
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Order Summary</h3>

        <div className="flex justify-between items-center">
          <p className="text-sm">Subtotal</p>
          <p className="text-sm font-bold">{IDR(subtotal)}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm">Tax (11%)</p>
          <p className="text-sm font-bold">{IDR(tax)}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm">Service (5%)</p>
          <p className="text-sm font-bold">{IDR(service)}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm">Discount ({discountSum}%)</p>
          <p className="text-sm font-bold">- {IDR(discountTotal)}</p>
        </div>

        {/* Kondisi hanya muncul kalau cash & belum settle */}
        {paymentMethod === "cash" && !isSettled && isServed && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm">Cash Back</p>
              <p className="text-sm font-bold">{IDR(cashBack)}</p>
            </div>

            <div className="space-y-4">
              <InputPrice
                label="Cash"
                name="cash"
                errors={error}
                value={cash}
                required
                onChange={handleCashInput}
                placeholder="Masukkan jumlah uang"
                className="text-right"
              />
            </div>
          </>
        )}
      </div>
    </CardContent>
  );
}
