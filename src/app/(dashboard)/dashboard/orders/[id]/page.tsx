import { title } from "process"
import OrderDetail from "./_components";

export const metaData = {
    title:'RESTOKU | Detail Order',
}
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    return <OrderDetail id={id} />;
}