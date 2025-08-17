import { title } from "process"
import OrderDetail from "./_components";
import Script from "next/script";
import { environment } from "@/config/environment";

export const metaData = {
    title:'RESTOKU | Detail Order',
}
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }>; }) {
    const { id } = await params;
    return (
        <>
            <Script
                src={`${environment.MIDTRANS_URL}/snap/snap.js`}
                data-client-key={`${environment.MIDTRANS_CLIENT_KEY}`}
                strategy="lazyOnload"
            />
            <OrderDetail id={id} />
        </>
    );
}