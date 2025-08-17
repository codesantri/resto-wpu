import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { IDR } from "@/lib/utils";
import { Menu } from "@/validations/menu-validation";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function CardMenu({ menu, onAddToCart }: { menu: Menu; onAddToCart: (item:Menu, type:'dec'|'inc')=>void;}) {
    return (
        <Card key={menu.id} className="w-full h-fit border shadow-sm p-0 gap-0">
            <Image src={`${menu.image_url}`} alt={menu.name} width={300} height={300} className="w-full lg:h-[200px] md:h-[150px] h-[100px] object-cover rounded-t-lg" />
            <CardContent className="px-4 py-2">
                <h1 className="lg:text-lg  font-semibold">{menu.name}</h1>
                <p className="text-sm text-muted-foreground line-clamp-2">{menu.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
                <div className="lg:text-xl font-bold">{IDR(menu.price)}</div>
                <Button className="cursor-pointer" onClick={()=>onAddToCart(menu, 'inc')}>
                    <ShoppingCart/>
                </Button>
            </CardFooter>
        </Card>
    )
}