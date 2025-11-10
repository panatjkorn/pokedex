// import { useState, useMemo } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { usePokemon } from "../context/PokemonContext";
// import PokemonCard from "./PokemonCard";
// import Pagination from "./Pagination";

// const TOTAL_POKEMONS = 151; // จำนวน Pokémon ทั้งหมด
// const LIMIT = 12;

// export default function PokeBlogLists() {
//   const { usePokemonList } = usePokemon();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();

//   // 🔹 page จาก query param
//   const pageParam = searchParams.get("page");
//   const page = pageParam ? Number(pageParam) : 1;

//   // 🔹 fetch Pokémon list
//   const { data: pokemons, isLoading } = usePokemonList(page);

//   const totalPages = Math.ceil(TOTAL_POKEMONS / LIMIT);

//   // 🔹 Pagination handlers
//   const goToPage = (p: number) => setSearchParams({ page: String(p) });
//   const nextPage = () => goToPage(Math.min(page + 1, totalPages));
//   const prevPage = () => goToPage(Math.max(page - 1, 1));

//   // 🔹 Search state
//   const [searchPokemon, setSearchPokemon] = useState("");

//   // 🔹 Filter Pokémon ตาม search term
//   const filteredPokemons = useMemo(() => {
//     return (
//       pokemons?.filter((poke) =>
//         poke.name.toLowerCase().includes(searchPokemon.toLowerCase())
//       ) ?? []
//     );
//   }, [pokemons, searchPokemon]);

//   if (isLoading)
//     return <p className="text-center p-6">Loading Pokémon...</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">Pokémon List</h2>

//       {/* Search */}
//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           placeholder="Search Pokémon..."
//           value={searchPokemon}
//           onChange={(e) => setSearchPokemon(e.target.value)}
//           className="w-full max-w-md px-4 py-2 rounded-2xl
//              bg-white/60 backdrop-blur-md
//              border border-white/50 shadow-sm
//              placeholder-gray-600 text-gray-800
//              focus:outline-none focus:ring-2 focus:ring-sky-300"
//         />
//       </div>

//       {/* Pokémon List */}
//       <div className="flex flex-wrap justify-center gap-6">
//         {filteredPokemons.length > 0 ? (
//           filteredPokemons.map((poke) => (
//             <div
//               key={poke.id}
//               className="basis-full sm:basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)] max-w-[250px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"
//             >
//               <PokemonCard
//                 pokeId={poke.id}
//                 name={poke.name}
//                 image={poke.image}
//                 pokeType={poke.types}
//                 link={`/pokemon/${poke.id}?page=${page}`}
//               />
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 w-full">No Pokémon found.</p>
//         )}
//       </div>

//       {/* Current Page Info */}
//       <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
//         <span className="text-gray-600">
//           Page {page} / {totalPages}
//         </span>
//       </div>

//       {/* Pagination */}
//       <Pagination
//         page={page}
//         totalPages={totalPages}
//         nextPage={nextPage}
//         prevPage={prevPage}
//         goToPage={goToPage}
//       />
//     </div>
//   );
// }
