import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { IS_GENERATE_PAYMENT } from "@/constants/payment.constan";
import { generatePaymentToken } from "@/controllers/payment-controller";
import usePricing from "@/hooks/use-pricing";
import { IDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect, useMemo } from "react";
import { toast } from "sonner";

interface SummaryProps {
  order: { 
    customer_name: string; 
    tables: { name: string; id?: string }[]; 
    status: string; 
  } | null | undefined;
  orderMenu: { menus: Menu; quantity: number; status: string }[] | undefined | null;
  id: string;
}

declare global{
    interface Window{
        snap:any
    }
}

export default function Summary({ order, orderMenu, id }: SummaryProps) {

  const {subtotal, discountTotal, discountSum, totalPrice, tax, service, grandTotal} = usePricing(orderMenu);
  
  const isServed = useMemo(() => {
    return orderMenu?.every((item) => item.status === 'served')
  }, [orderMenu]);
  const isSettled = useMemo(() => {
    return order?.status==='settled'
  }, [order]);

  const [generatePaymentState, generatePaymentAction, isPendingGeneratePayment] = useActionState(generatePaymentToken, IS_GENERATE_PAYMENT);

  const handleGeneratePayment = () => {
    const formData = new FormData();
    formData.append('id', id || '');
    formData.append('gross_amount', grandTotal.toString());
    formData.append('customer_name', order?.customer_name||'');
    
    startTransition(() => {
      generatePaymentAction(formData);
    })
  };

  useEffect(() => {
    if (generatePaymentState?.status === "error") {
      toast.error("Process payment failed", {
        description: generatePaymentState.errors?._form?.[0],
      });
    }
    if (generatePaymentState?.status === "success") {
      window.snap.pay(generatePaymentState.data.payment_token);
    }
  }, [generatePaymentState]);

  const handleChangePayment = () => {
    
  }

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
              {order && (
                  <div className="space-y-4">
                      <div className="space-y-2">
                          <Label>Customer Name</Label>
                          <Input value={order?.customer_name} disabled/>
                      </div>
                      <div className="space-y-2">
                          <Label>Table Name</Label>
                          <Input value={(order?.tables as unknown as {name:string})?.name} disabled/>
                      </div>
                  </div>
              )}
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
                      <p className="text-sm">Discount ({discountSum} %)</p>
                      <p className="text-sm font-bold">- {IDR(discountTotal)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-sm">Cash Back </p>
                      <p className="text-sm font-bold">- {IDR(discountTotal)}</p>
                  </div>
      
                  <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cash Money</Label>
                            <Input placeholder="Rp.0" autoFocus inputMode="numeric"/>
                      </div>
                  </div>
          </div>
      </CardContent>
      {!isSettled && (
        <CardFooter className="flex flex-col gap-3 items-start">
        <Separator />
        <div className="text-star flex items-center">
                <Label>Payment Method :</Label>
               <RadioGroup defaultValue="cash" className="flex items-center mx-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="cash" value="cash" className="h-5 w-5 cursor-pointer border-1 border-teal-500" />
                    <Label className="font-semibold text-muted-foreground" htmlFor="cash">Cash</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="online" value="online" className="h-5 w-5 cursor-pointer border-1 border-teal-500" />
                    <Label className="font-semibold text-muted-foreground" htmlFor="online">Transfer</Label>
                  </div>
                </RadioGroup>
              </div>
        <Button className="w-full cursor-pointer font-bold text-1xl" size='lg'
          type="submit"
          disabled={!isServed||isPendingGeneratePayment}
          onClick={handleGeneratePayment}
        >
          {isPendingGeneratePayment ? <Loader2 className="animate-spin"/>: ''} Pay {IDR(grandTotal)}
        </Button>
      </CardFooter>
      )}
    </Card>
  );
}
