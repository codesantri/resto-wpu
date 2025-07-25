import { useRef } from "react";

export default function useSearchDebounce() {
    const debounceTimeOut = useRef<NodeJS.Timeout | null>(null);

    const debounce = (func: () => void, delay: number) => {
        if (debounceTimeOut.current) clearTimeout(debounceTimeOut.current);

        debounceTimeOut.current = setTimeout(() => {
            func();
            debounceTimeOut.current = null;
        }, delay);
    };
    return debounce;
}