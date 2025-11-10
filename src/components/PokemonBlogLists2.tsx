// import { useEffect, useState } from "react"
// import PokemonCard from "./PokemonCard"

// type Pokemon = {
//   name: string
//   image: string
// }

// export default function PokeBlogLists() {
//   const [pokemons, setPokemons] = useState<Pokemon[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchPokemons = async () => {
//       try {
//         const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12&offset=0")
//         const data = await res.json()

//         const results = await Promise.all(
//           data.results.map(async (poke: any) => {
//             const res = await fetch(poke.url)
//             const details = await res.json()
//             return {
//               name: poke.name,
//               image: details.sprites.other["official-artwork"].front_default,
//             }
//           })
//         )

//         setPokemons(results)
//       } catch (error) {
//         console.error("Error fetching pokemons:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPokemons()
//   }, [])

//   if (loading) return <p className="p-6 text-center">Loading Pokémon...</p>

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Pokémon List</h2>
//       <div className="flex flex-wrap gap-6 justify-center">
//         {pokemons.map(poke => (
//           <PokemonCard key={poke.name} name={poke.name} image={poke.image} />
//         ))}
//       </div>
//     </div>
//   )
// }

import { usePokemon } from "../context/PokemonContext"
import PokemonCard from "./PokemonCard"

export default function PokeBlogLists() {
  const { pokemons, loading } = usePokemon()

  if (loading) return <p className="p-6 text-center">Loading Pokémon...</p>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Pokémon List</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {pokemons.map(poke => (
          <div
            key={poke.name}
            className="basis-full sm:basis-[calc(50%-1.5rem)] lg:basis-[calc(25%-1.5rem)] max-w-[250px] flex-grow bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PokemonCard name={poke.name} image={poke.image} />
          </div>
        ))}
      </div>
      
    </div>
  )
}

