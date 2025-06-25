import {useEffect, useState} from "react";


const useLoading = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState("")

    useEffect(() => {
            if (status === "pending") {
                setIsLoading(true)
            } else {
                setIsLoading(false)
            }
        }, [status]
    );

    return {status, setStatus, isLoading, setIsLoading};
}

export default useLoading;
