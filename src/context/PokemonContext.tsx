import React, { createContext, useContext, useEffect, useState } from "react";

export type Ability = {
  name: string;
  is_hidden: boolean;
};

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: Ability[];
};

type PokemonContextType = {
  pokemons: Pokemon[];
  loading: boolean;
  page: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  getPokemonById: (id: number) => Promise<Pokemon | undefined>;
  getPokemonWithEvolutionById: (
    id: number
  ) => Promise<{ pokemon?: Pokemon; evolution: { id: number; name: string; image: string }[] }>;
};

type PokemonProviderProps = { children: React.ReactNode };

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const PokemonProvider = ({ children }: PokemonProviderProps) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [evolutionCache, setEvolutionCache] = useState<Record<number, any[]>>({});
  const [totalPokemons, setTotalPokemons] = useState(0);
  const limit = 12;
  const totalPages = Math.ceil(totalPokemons / limit);

  const fetchPokemons = async (pageNum: number) => {
    setLoading(true);
    const offset = (pageNum - 1) * limit;
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();
      setTotalPokemons(data.count);

      const results = await Promise.all(
        data.results.map(async (poke: any) => {
          const resDetail = await fetch(poke.url);
          const details = await resDetail.json();
          return {
            id: details.id,
            name: details.name,
            image: details.sprites.other["official-artwork"].front_default,
            types: details.types.map((t: any) => t.type.name),
            stats: details.stats.map((s: any) => ({
              name: s.stat.name,
              value: s.base_stat,
            })),
            abilities: details.abilities.map((a: any) => ({
              name: a.ability.name,
              is_hidden: a.is_hidden,
            })),
          };
        })
      );
  
      setPokemons(results);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const getPokemonById = async (id: number): Promise<Pokemon | undefined> => {
    const found = pokemons.find((p) => p.id === id);
    if (found && found.abilities) return found; // มี abilities แล้ว return
  
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        abilities: data.abilities.map((a: any) => ({
          name: a.ability.name,
          is_hidden: a.is_hidden,
        })),
      };
  
      setPokemons((prev) => {
        const exist = prev.find((p) => p.id === id);
        if (exist) return prev.map((p) => (p.id === id ? pokemon : p));
        return [...prev, pokemon];
      });
  
      return pokemon;
    } catch (error) {
      console.error("Error fetching pokemon by id:", error);
      return undefined;
    }
  };
  

  // Pokémon + Evolution Chain
  const getPokemonWithEvolutionById = async (id: number) => {
    const pokemon = await getPokemonById(id);
    if (!pokemon) return { pokemon: undefined, evolution: [] };

    if (evolutionCache[id]) return { pokemon, evolution: evolutionCache[id] };

    try {
      const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      const speciesData = await resSpecies.json();

      const resEvolution = await fetch(speciesData.evolution_chain.url);
      const evoData = await resEvolution.json();

      const evolution: { id: number; name: string; image: string }[] = [];
      const traverse = (chain: any) => {
        const idFromUrl = Number(chain.species.url.split("/").filter(Boolean).pop());
        evolution.push({
          id: idFromUrl,
          name: chain.species.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idFromUrl}.png`,
        });
        chain.evolves_to.forEach((c: any) => traverse(c));
      };
      traverse(evoData.chain);

      setEvolutionCache((prev) => ({ ...prev, [id]: evolution }));
      return { pokemon, evolution };
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return { pokemon, evolution: [] };
    }
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page]);

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);
  const goToPage = (p: number) => p >= 1 && p <= totalPages && setPage(p);

  return (
    <PokemonContext.Provider
      value={{
        pokemons,
        loading,
        page,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        getPokemonById,
        getPokemonWithEvolutionById,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context) throw new Error("usePokemon must be used within a PokemonProvider");
  return context;
};
