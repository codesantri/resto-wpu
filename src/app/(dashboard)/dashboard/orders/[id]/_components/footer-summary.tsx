import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IDR } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Props {
  isSettled: boolean |undefined|null;
  paymentMethod: string |undefined|null;
  handleChangePaymentMethod: (value: string) => void |undefined|null;
  isServed: boolean |undefined|null;
  isPendingGeneratePayment: boolean|undefined|null;
  isPendingCashPayment: boolean|undefined|null;
  cash: string|'';
  grandTotal: number|0;
  handleCashPayment: () => void|undefined|null;
  handleGeneratePayment: () => void|undefined|null;
  id: string | number|undefined;
}

export default function FooterSummary({
  isSettled,
  paymentMethod,
  handleChangePaymentMethod,
  isServed,
  isPendingGeneratePayment,
  isPendingCashPayment,
  cash,
  grandTotal,
  handleCashPayment,
  handleGeneratePayment,
  id
}: Props) {
  return (
    <>
      {isServed &&(
      <CardFooter className="flex flex-col gap-3 items-start">
        <Separator />
        {!isSettled ? (
          <>
            <div className="text-start flex items-center">
              <Label>Payment Method :</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={handleChangePaymentMethod}
                className="flex items-center mx-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="cash"
                    value="cash"
                    className="h-5 w-5 cursor-pointer border-1 border-teal-500"
                  />
                  <Label
                    className="font-semibold text-muted-foreground cursor-pointer"
                    htmlFor="cash"
                  >
                    Cash
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="online"
                    value="online"
                    className="h-5 w-5 cursor-pointer border-1 border-teal-500"
                  />
                  <Label
                    className="font-semibold text-muted-foreground cursor-pointer"
                    htmlFor="online"
                  >
                    Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className="w-full cursor-pointer font-bold text-xl"
              size="lg"
              type="submit"
              disabled={
                !isServed ||
                isPendingGeneratePayment ||
                isPendingCashPayment ||
                (paymentMethod === "cash" && (parseInt(cash) || 0) < grandTotal)
              }
              onClick={paymentMethod === "cash" ? handleCashPayment : handleGeneratePayment}
            >
              {(isPendingGeneratePayment || isPendingCashPayment) && (
                <Loader2 className="animate-spin mr-2" />
              )}
              Pay ({IDR(grandTotal)})
            </Button>
          </>
        ) : (
          <Link className="w-full" href={`/payment/success?order_id=${id}`}>
            <Button className="w-full cursor-pointer" variant="outline">
              Detail Transactions
            </Button>
          </Link>
        )}
      </CardFooter>
      )}
    </>
  );
}
