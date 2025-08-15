import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IDR } from "@/lib/utils";
import { Cart } from "@/types/order-cart";
import { Menu } from "@/validations/menu-validation";
import { Armchair, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface CartProps {
  order: { 
    customer_name: string; 
    tables: { name: string; id?: string }[]; 
    status: string; 
  } | null | undefined;
    carts: Cart[];
    setCarts: Dispatch<SetStateAction<Cart[]>>;
    onAddToCart: (item:Menu, type:'dec'|'inc')=>void;
}
export default function OrderCart({ order, carts, setCarts, onAddToCart }: CartProps) {
    

    return (
        <Card className="w-full shadow-sm">
            <CardContent className="space-y-4">
            {/* <h3 className="text-lg font-semibold">Customer Information</h3> */}
              {/* {order && (
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
              <Separator /> */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-semibold flex gap-2">
                            <ShoppingCart className="size-6" /> Carts for
                        </h3>
                        <h3 className="flex gap-2 text-lg font-semibold">
                            <Armchair className="size-6"/>
                            {(order?.tables as unknown as { name: string })?.name}
                        </h3>
                    </div>
                    <Separator/>
                {carts.length > 0 ? (
                        carts?.map((item:Cart, index) => (
                        <div key={index} className="space-y-2 border-b p-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={item.menu.image_url as string}
                                            alt={item.menu.image_url as string}
                                            width={60}
                                            height={60}
                                            className="rounded"
                                        />
                                        <div className="">
                                            <p className="tex-sm">{item.menu.name}</p>
                                            <div className="flex gap-1">
                                                <p className="tex-xs text-muted-foreground">{IDR(item.total / item.quantity)} x </p>
                                                <span className="h-5 min-w-5 text-center text-white text-sm bg-danger rounded-full px-1 font-mono tabular-nums">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <p className="text-sm">{IDR(item.total)}</p>
                                </div>
                        </div>
                    ))
                    ) : (
                            <p className="text-sm"> The cart empty</p>
                    )}
                    <div className="">
                        <Button className="cursor-pointer w-full">
                            Procces Order
                        </Button>
                    </div>
              </div>
            </CardContent>
        </Card>
    )
}