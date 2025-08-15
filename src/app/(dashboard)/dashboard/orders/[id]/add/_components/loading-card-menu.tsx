import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCardMenu() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="w-full h-fit border shadow-sm p-0 gap-0"
        >
          {/* Gambar */}
          <Skeleton className="w-full h-[200px] rounded-t-lg" />

          {/* Konten */}
          <CardContent className="px-4 py-2 space-y-2">
            {/* Nama menu */}
            <Skeleton className="h-5 w-3/4" />
            {/* Deskripsi */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex justify-between items-center p-4">
            {/* Harga */}
            <Skeleton className="h-6 w-20" />
            {/* Tombol */}
            <Skeleton className="h-10 w-10 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
