"use client";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useFetch } from "../hooks/useFetch";

export default function Pokemon() {
    const [typeFilter, setTypeFilter] = useState("");
    const [limit, setLimit] = useState(50);
    const [searchTerm, setSearchTerm] = useState("");
    const [types, setTypes] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    { /* Utilisation du Hook fait maison */ }
    const { loading, data, errors } = useFetch(
        `https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limit}`
    )

    {/* Récupérer les types */}
    useEffect(() => {
        fetch("https://nestjs-pokedex-api.vercel.app/types")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des types");
                }
                return response.json();
            })
            .then((data) => {
                setTypes(data.map((type) => ({ name: type.name, id: type.id })));
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des types :", error);
            });
    }, []);

    {/* Filtrer */}
    const filteredData = data?.filter((pokemon) => {
        const nameMatch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = typeFilter === "" || pokemon.types.some(type => type.name.toLowerCase() === typeFilter.toLowerCase());
        return nameMatch && typeMatch;
    });

    return (
        <div className="h-full px-8 py-4 bg-slate-800">
            <h1 className="text-7xl font-bold text-center text-white">Pokédex 🌚</h1>

            <div className="pt-4">
                <div className="fixed flex flex-wrap gap-4 items-center mb-4">
                    <input
                        className="rounded-full w-50 p-4 bg-slate-50"
                        type="search"
                        id="search"
                        placeholder="Recherche par nom"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="rounded-full p-4 bg-slate-50"
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="">Tous les types</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="rounded-full p-4 bg-slate-50 w-50"
                        onChange={(e) => setLimit(Number(e.target.value))}
                        defaultValue={50}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4 mt-20">
                    {filteredData?.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="p-4 bg-zinc-200 rounded shadow cursor-pointer"
                            onClick={() => setSelectedPokemon(pokemon)}
                        >
                            <p className="text-gray-600 text-end">#{pokemon.pokedexId}</p>
                            <img src={pokemon.image} alt={pokemon.name} className="w-full h-32 object-cover" />
                            <h2 className="text-lg font-bold text-center mt-2">{pokemon.name}</h2>
                        </div>
                    ))}
                </div>

                {errors && <p className="text-red-500 text-8xl">Oups, il y a quelque chose qui ne va pas.. 🧐 : {errors.message}</p>}
            </div>

            
            {/* Affiche une barre de progression pendant le chargement des données */}
            <div className="w-100 mt-10">
                {loading && <Progress value={33} />}
            </div>

            {/* Affichage des détails du Pokémon sélectionné */}
            {selectedPokemon && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                        <button
                            className="text-black text-lg absolute top-4 right-4 bg-blue-500 p-2 rounded-lg"
                            onClick={() => setSelectedPokemon(null)}
                        >
                            Fermer
                        </button>
                        <img
                            src={selectedPokemon.image}
                            alt={selectedPokemon.name}
                            className="w-48 h-48 mx-auto object-cover"
                        />
                        <h2 className="text-xl font-bold text-center mt-4">{selectedPokemon.name}</h2>
                        <p className="text-center text-gray-600">#{selectedPokemon.pokedexId}</p>
                        <ul className="mt-4">
                            {selectedPokemon.stats ? (
                                Object.entries(selectedPokemon.stats).map(([statName, statValue]) => (
                                    <li key={statName} className="flex justify-between">
                                        <span className="font-medium">{statName}</span>
                                        <span>{statValue}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">Il n'y a aucune stat de dispo</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

