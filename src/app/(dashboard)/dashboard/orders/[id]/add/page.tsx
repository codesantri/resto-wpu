import { title } from "process"
import OrderAdd from "./_components";

export const metaData = {
    title:'RESTOKU | Add New Order',
}
export default async function OrderAddPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    return <OrderAdd id={id} />;
}