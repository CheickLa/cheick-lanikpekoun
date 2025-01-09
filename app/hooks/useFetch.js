import { useState, useEffect } from "react";

// Hook fait maison pour récupérer les pokemons
export function useFetch(api) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(api)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données");
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des données :", error);
                setErrors(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [api]);

    return {
        loading,
        data,
        errors,
    };
}