import {useEffect, useState} from "react";

const usePagePlus = () => {
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const reachedBottom = Math.floor(document.documentElement.scrollHeight) === Math.floor(window.scrollY) + window.innerHeight;
            if (!isScrollLocked &&
                document.body.offsetHeight > window.innerHeight &&
                reachedBottom
            ) {
                setIsScrollLocked(true); // Блокируем
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isScrollLocked]);

    return {page, setPage, setIsScrollLocked};
}

export default usePagePlus;
