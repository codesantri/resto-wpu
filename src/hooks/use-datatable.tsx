
import { useState } from "react";
import useSearchDebounce from "./use-search-debounce";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/tables/pagination-table";

export default function useDataTable() {
    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
    const [currentSearch, setCurrentSearch] = useState('');
    const debounce = useSearchDebounce();

    const handleChangePage = (page: number) => {
        setCurrentPage(page);
    };

    const handleChangeLimit = (limit: number) => {
        setCurrentLimit(limit);
        setCurrentPage(DEFAULT_PAGE);
    };

    const handleChangeSearch = (search: string) => {
        debounce(() => {
            setCurrentSearch(search);
            setCurrentPage(DEFAULT_PAGE);
        }, 300);
    };

    return {
        currentPage,
        handleChangePage,
        currentLimit,
        handleChangeLimit,
        currentSearch,
        handleChangeSearch,
    }
}