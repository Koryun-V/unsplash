import {useMemo} from "react";
import {useSearchParams} from "react-router-dom";

export const useQuery = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const query = useMemo(() => {
        const queryParams = {}

        searchParams.entries().forEach(([key, value]) => {
            if (queryParams [key]) {
                queryParams[key] = [...(Array.isArray(queryParams[key]) ? queryParams[key] : [queryParams | [key]]), value]
            } else {
                queryParams [key] = value
            }
        })

        return queryParams
    }, [searchParams])


    const deleteEmptyKeys = (queryParams) => {
        const clearedParams = {};

        Object.entries(queryParams).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length) {
                clearedParams [key] = value.filter(item => item);
            } else if (value) {
                clearedParams [key] = value;
            }

        });

        return clearedParams;
    }

    const setQuery = (queryParams, options = {}) => setSearchParams(deleteEmptyKeys(queryParams), options);

    return {
        query,
        queryString: `?${searchParams.toString()}`,
        setQuery,
    }
}



