import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

type DataTableProps = {
  totalPages:number;
  currentPage:number;
  onChangePage:(page:number)=>void;
};
export default function PaginationDatatable(
    {currentPage, onChangePage, totalPages,}: DataTableProps
) {
    return (
        <Pagination className="">
            <PaginationContent>
                <PaginationItem>
                   <PaginationPrevious
                    className={`cursor-pointer ${currentPage === 1 ? 'hidden' : ''}`}
                    onClick={() => {
                        if (currentPage > 1) {
                        onChangePage(currentPage - 1);
                        }
                    }}
                    />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1) {
                        return (
                            <PaginationItem key={page}>
                                    <PaginationLink className="cursor-pointer"
                                        isActive={page === currentPage}
                                        onClick={() => {
                                            if (page !==currentPage) onChangePage(page)
                                        }}
                                    >
                                        {page}
                                    </PaginationLink>
                            </PaginationItem>
                        )
                    }
                    if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages)) {
                        return (
                            <PaginationItem key={`ellipsis-${page}`}>
                                <PaginationEllipsis/>
                            </PaginationItem>
                        )
                    }
                })}
                <PaginationItem >
                    <PaginationNext
                        className={`cursor-pointer ${currentPage === totalPages ? 'hidden' : ''}`}
                        onClick={() => {
                            if (currentPage < totalPages) {
                            onChangePage(currentPage + 1);
                            }
                        }}
                    />

                    </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}