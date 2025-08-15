import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import usePricing from "@/hooks/use-pricing";
import { IDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";

interface SummaryProps {
  order: { 
    customer_name: string; 
    tables: { name: string; id?: string }[]; 
    status: string; 
  } | null | undefined;
  orderMenu: { menus: Menu; quantity: number; status: string }[] | undefined | null;
  id: string;
}

export default function Summary({ order, orderMenu, id }: SummaryProps) {
    const { grandTotal, totalPrice, tax, service } = usePricing(orderMenu);

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
                      <p className="text-sm font-bold">{IDR(totalPrice)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-sm">Tax (11%)</p>
                      <p className="text-sm font-bold">{IDR(tax)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                      <p className="text-sm">Service (5%)</p>
                      <p className="text-sm font-bold">{IDR(service)}</p>
                  </div>
                <Separator />
                <div className="flex justify-between items-center">
                      <p className="text-lg">Total</p>
                      <p className="text-lg font-bold">{IDR(grandTotal)}</p>
                  </div>
              </div>
      </CardContent>
    </Card>
  );
}
