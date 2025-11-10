import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

export type Ability = { name: string; is_hidden: boolean };
export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: Ability[];
};
export type Evolution = { id: number; name: string; image: string };

type PokemonContextType = {
  usePokemonList: (page: number) => UseQueryResult<Pokemon[], unknown>;
  usePokemonDetail: (id: number) => UseQueryResult<Pokemon, unknown>;
  usePokemonWithEvolution: (id: number) => {
    pokemonQuery: UseQueryResult<Pokemon, unknown>;
    evolutionQuery: UseQueryResult<Evolution[], unknown>;
  };
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context)
    throw new Error("usePokemon must be used within a PokemonProvider");
  return context;
};

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const limit = 12;

  const usePokemonList = (page: number) =>
    useQuery<Pokemon[]>({
      queryKey: ["pokemons", page],
      queryFn: async () => {
        const offset = (page - 1) * limit;
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();

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
        return results;
      },
      staleTime: 1000 * 60 * 5,
    });

  const usePokemonDetail = (id: number) =>
    useQuery<Pokemon>({
      queryKey: ["pokemon", id],
      queryFn: async () => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        return {
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
      },
      staleTime: 1000 * 60 * 5,
    });

  const usePokemonWithEvolution = (id: number) => {
    const pokemonQuery = usePokemonDetail(id);

    const evolutionQuery = useQuery<Evolution[]>({
      queryKey: ["pokemon-evolution", id],
      queryFn: async () => {
        // ต้องรอจนกว่าจะมี pokemonQuery.data ก่อนถึงจะใช้ species API ได้
        const resSpecies = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}/`
        );
        const speciesData = await resSpecies.json();

        const resEvolution = await fetch(speciesData.evolution_chain.url);
        const evoData = await resEvolution.json();

        const evolution: Evolution[] = [];
        const traverse = (chain: any) => {
          const idFromUrl = Number(
            chain.species.url.split("/").filter(Boolean).pop()
          );
          evolution.push({
            id: idFromUrl,
            name: chain.species.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idFromUrl}.png`,
          });
          chain.evolves_to.forEach((c: any) => traverse(c));
        };
        traverse(evoData.chain);

        return evolution;
      },
      enabled: !!pokemonQuery.data, // จะรันก็ต่อเมื่อข้อมูล Pokémon โหลดเสร็จแล้ว
      staleTime: 1000 * 60 * 5,
    });

    return {
      pokemonQuery,
      evolutionQuery,
    };
  };

  return (
    <PokemonContext.Provider
      value={{
        usePokemonList,
        usePokemonDetail,
        usePokemonWithEvolution,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
