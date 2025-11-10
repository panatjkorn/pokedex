import { useState } from "react";
import { usePokemon } from "../context/PokemonContext";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";


export default function PokeBlogLists() {
  const { pokemons, loading, page, totalPages, nextPage, prevPage, goToPage } =
    usePokemon();

  const [searchPokemon, setSearchPokemon] = useState("");

  if (loading) return <p className="text-center p-6">Loading Pokémon...</p>;

  // 🔹 Filter Pokémon ตาม search term
  const filteredPokemons = pokemons.filter((poke) =>
    poke.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Pokémon List</h2>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchPokemon}
          onChange={(e) => setSearchPokemon(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-2xl
             bg-white/60 backdrop-blur-md
             border border-white/50 shadow-sm
             placeholder-gray-600 text-gray-800
             focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((poke) => (
            <div
              key={poke.name}
              className="basis-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)] max-w-[250px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"
            >
              <PokemonCard pokeId={poke.id} name={poke.name} image={poke.image} pokeType={poke.types} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 w-full">No Pokémon found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        nextPage={nextPage}
        prevPage={prevPage}
        goToPage={goToPage}
      />
    </div>
  );
}
