import InputPrice from "@/components/common/price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { IS_CASH_PAYMENT, IS_ONLINE_PAYMENT } from "@/constants/payment.constan";
import { cashPayment, generatePaymentToken } from "@/controllers/payment-controller";
import usePricing from "@/hooks/use-pricing";
import { IDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import FooterSummary from "./footer-summary";
import MainSummary from "./main-summary";

interface SummaryProps {
  order: { 
    id: string;
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

  const { subtotal, discountTotal, discountSum, tax, service, grandTotal } = usePricing(orderMenu);
  const [generatePaymentState, generatePaymentAction, isPendingGeneratePayment] = useActionState(generatePaymentToken, IS_ONLINE_PAYMENT);
  const [cashPaymentState, cashPaymentAction, isPendingCashPayment] = useActionState(cashPayment, IS_CASH_PAYMENT);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cash, setCash] = useState("");
  const [cashBack, setCashBack] = useState(0);
  const [error, setError] = useState("");

  const isServed = useMemo(() => {
    return orderMenu?.every((item) => item.status === 'served')
  }, [orderMenu]);
  
  const isSettled = useMemo(() => {
    return order?.status === 'settled'
  }, [order]);


  const handleChangePaymentMethod = () => {
    if (paymentMethod==='cash') {
      setPaymentMethod("online")
    } else {
      setPaymentMethod("cash")
    }
    setCash("");
    setCashBack(0);
    setError("");
  }

  const handleCashInput = (formattedValue: string, rawValue: string) => {
    setCash(rawValue);
    
    const cashAmount = parseInt(rawValue) || 0;
    
    if (cashAmount < grandTotal) {
      setError(`Uang kurang, masukkan ${IDR(grandTotal)} atau lebih`);
      setCashBack(0);
    } else {
      setError("");
      setCashBack(cashAmount - grandTotal);
    }
  };

  const handleGeneratePayment = () => {
    const formData = new FormData();
    formData.append('id', order?.id || '');
    formData.append('order_id', id || '');
    formData.append('tax', tax.toString());
    formData.append('service', service.toString());
    formData.append('discount', discountTotal.toString());
    formData.append('total_payment', grandTotal.toString());
    formData.append('subtotal', subtotal.toString());
    formData.append('customer_name', order?.customer_name || '');
    startTransition(() => {
      generatePaymentAction(formData);
    });
  };

  const handleCashPayment = () => {
    const cashAmount = parseInt(cash) || 0;
    
    if (cashAmount < grandTotal) {
      toast.error('Uang tidak cukup!');
      return;
    }    
    const formData = new FormData();
    formData.append('id', order?.id || '');
    formData.append('order_id', id || '');
    formData.append('cash', cashAmount.toString());
    formData.append('cash_back', cashBack.toString());
    formData.append('discount', discountTotal.toString());
    formData.append('tax', tax.toString());
    formData.append('service', service.toString());
    formData.append('total_payment', grandTotal.toString());
    formData.append('subtotal', subtotal.toString());
    startTransition(() => {
      cashPaymentAction(formData);
    });
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

  useEffect(() => {
    if (cashPaymentState?.status === "error") {
      toast.error("Cash payment failed", {
        description: cashPaymentState.errors?._form?.[0],
      });
    }
    if (cashPaymentState?.status === "success") {
      toast.success("Cash payment successful!");
    }
  }, [cashPaymentState]);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
          <CardTitle className="mb-1">
            <h3 className="text-lg font-semibold">Order ID : {id}</h3>
          </CardTitle>
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
      </CardHeader>
        {orderMenu && orderMenu.length > 0 && (
        <>
          <MainSummary
            subtotal={subtotal}
            tax={tax}
            service={service}
            discountSum={discountSum}
            discountTotal={discountTotal}
            paymentMethod={paymentMethod}
            isSettled={isSettled} 
            isServed={isServed}
            handleCashInput={handleCashInput}
            error={error}
            cashBack={cashBack}
            cash={cash}                
          />
          <FooterSummary
            isSettled={isSettled}
            paymentMethod={paymentMethod}
            handleChangePaymentMethod={handleChangePaymentMethod}
            isServed={isServed}
            isPendingGeneratePayment={isPendingGeneratePayment}
            isPendingCashPayment={isPendingCashPayment}
            cash={cash}
            grandTotal={grandTotal}
            handleCashPayment={handleCashPayment}
            handleGeneratePayment={handleGeneratePayment}
            id={id}
          />

          </>
      )}
    </Card>
  );
}