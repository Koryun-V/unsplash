// import { useEffect, useState } from "react";
//
// const usePagePlus = () => {
//     const [page, setPage] = useState(1);
//     const [isScrollLocked, setIsScrollLocked] = useState(false);
//
//     useEffect(() => {
//         const onScroll = () => {
//             const scrollTop = window.scrollY || document.documentElement.scrollTop;
//             const windowHeight = window.innerHeight;
//             const fullHeight = document.documentElement.scrollHeight;
//
//             if (
//                 !isScrollLocked &&
//                 fullHeight - (scrollTop + windowHeight) <= 100
//             ) {
//                 setIsScrollLocked(true);
//                 setPage((prev) => prev + 1);
//             }
//         };
//
//         window.addEventListener("scroll", onScroll);
//         return () => window.removeEventListener("scroll", onScroll);
//     }, [isScrollLocked]);
//
//     useEffect(() => {
//         const checkInitial = () => {
//             const fullHeight = document.documentElement.scrollHeight;
//             const windowHeight = window.innerHeight;
//
//             if (!isScrollLocked && fullHeight <= windowHeight) {
//                 setIsScrollLocked(true);
//                 setPage((prev) => prev + 1);
//             }
//         };
//
//         setTimeout(checkInitial, 50);
//     }, [isScrollLocked]);
//
//     return { page, setPage, setIsScrollLocked };
// };
//
// export default usePagePlus;



import {useEffect, useState} from "react";

const usePagePlus = () => {
    const [page, setPage] = useState(1);
    const [isScrollLocked, setIsScrollLocked] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (!isScrollLocked &&
                fullHeight - (scrollTop + windowHeight) <= 100
            ) {
                setIsScrollLocked(true);
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isScrollLocked]);


    return {page, setPage, setIsScrollLocked};
}

export default usePagePlus;
