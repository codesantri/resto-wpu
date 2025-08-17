import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IDR } from "@/lib/utils";
import { Cart } from "@/types/order-cart";
import { Menu } from "@/validations/menu-validation";
import { Armchair, Loader2, Minus, MinusCircle, PlusCircle, ShoppingCart, Trash, Trash2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction} from "react";
import { AddNote } from "./add-note";
interface CartProps {
  order:| {customer_name: string; tables: { name: string; id?: string }[]; status: string;}| null| undefined;
  carts: Cart[];
  setCarts: Dispatch<SetStateAction<Cart[]>>;
  onAddToCart: (item: Menu, type: "dec" | "inc") => void;
  removeItemCart: (id: string) => void;
  onAddOrder: () => void;
  isLoading: boolean;
}

export default function OrderCart({
  order,
  carts,
  setCarts,
  onAddToCart,
  removeItemCart,
  onAddOrder,
  isLoading,
}: CartProps) {

 

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold flex gap-2 items-center">
              <ShoppingCart className="size-6" /> Carts for
            </h3>
            <h3 className="flex gap-2 text-lg font-semibold items-center">
              <Armchair className="size-6" />
              {(order?.tables as unknown as { name: string })?.name || "-"}
            </h3>
          </div>
          <Separator />


          {carts.length > 0 ? (
          carts.map((item, index) => (
            <div
              key={index}
              className="relative p-3 border-b last:border-none bg-muted rounded-md space-y-2"
            >
              {/* Action Buttons (Top Right) */}
              <div className="absolute top-2 right-2 flex items-center gap-1 gap-x-4">
                <Trash onClick={()=>removeItemCart(item.menu_id)} className="size-4 text-danger cursor-pointer" />
              </div>

              <div className="flex items-center gap-3">
                {/* Image */}
                <Image
                  src={item.menu.image_url as string}
                  alt={item.menu.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />

                {/* Menu Info & Quantity */}
                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-sm font-bold">{item.menu.name}</p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {IDR(item.total / item.quantity)}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => onAddToCart(item.menu!, "dec")}
                    >
                      <MinusCircle className="text-danger" size={14} />
                    </Button>
                    <span className="px-2 py-0.5 text-sm font-mono bg-muted rounded">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      className="cursor-pointer"
                      variant="outline"
                      onClick={() => onAddToCart(item.menu!, "inc")}
                    >
                      <PlusCircle size={14} className="text-success" />
                    </Button>
                    <AddNote
                      menuName={item.menu.name}
                      id={item.menu_id}
                      notes={item.notes}
                      item={item.menu}
                      setCarts={setCarts}
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="flex flex-col">
                  <p className="text-md font-bold">{IDR(item.total)}</p>
                </div>
              </div>

              {/* Notes Preview */}
              {item.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="font-medium">Notes:</span> {item.notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-center text-muted-foreground">
            The cart is empty
          </p>
        )}


          {/* Action Button */}
          <Button
            disabled={carts.length < 1}
            className="cursor-pointer w-full"
            type="button"
            onClick={onAddOrder}
            >
            {isLoading ? <Loader2 className="animate-spin" /> : "Process Order"}
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}
