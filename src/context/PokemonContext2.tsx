import React, { createContext, useContext, useEffect, useState } from "react"

type Pokemon = {
  name: string
  image: string
}

type PokemonContextType = {
  pokemons: Pokemon[]
  loading: boolean
}

type PokemonProviderProps = {
  children: React.ReactNode
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12&offset=0")
        const data = await res.json()

        const results = await Promise.all(
          data.results.map(async (poke: any) => {
            const res = await fetch(poke.url)
            const details = await res.json()
            return {
              name: poke.name,
              image: details.sprites.other["official-artwork"].front_default,
            }
          })
        )

        setPokemons(results)
      } catch (error) {
        console.error("Error fetching pokemons:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemons()
  }, [])

  return (
    <PokemonContext.Provider value={{ pokemons, loading }}>
      {children}
    </PokemonContext.Provider>
  )
}

export const usePokemon = () => {
  const context = useContext(PokemonContext)
  if (!context) throw new Error("usePokemon must be used within a PokemonProvider")
  return context
}
