import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext";
import { typeColors } from "../constants/pokemonTypeColors";

type Stat = { name: string; value: number };

export default function PokemonDetailPage() {
  const { id } = useParams();
  const { usePokemonWithEvolution } = usePokemon();
  const pokemonId = id ? Number(id) : 0;

  // 🔹 Fetch Pokémon + Evolution
  const { pokemonQuery, evolutionQuery } = usePokemonWithEvolution(pokemonId);
  const pokemon = pokemonQuery.data;
  const evolution = evolutionQuery.data ?? [];
  const isLoading = pokemonQuery.isLoading || evolutionQuery.isLoading;

  // 🔹 Animated stats
  const [animatedStats, setAnimatedStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (!pokemon) return;

    // เริ่มจาก value = 0
    setAnimatedStats(pokemon.stats.map((s) => ({ ...s, value: 0 })));

    pokemon.stats.forEach((s, idx) => {
      let current = 0;
      const interval = setInterval(() => {
        current += 3;
        setAnimatedStats((prev) => {
          const copy = [...prev];
          copy[idx].value = Math.min(current, s.value);
          return copy;
        });
        if (current >= s.value) clearInterval(interval);
      }, 15);
    });
  }, [pokemon]);

  if (isLoading || !pokemon)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading Pokémon...
      </div>
    );

  return (
    <div className="w-full min-h-screen p-6 flex flex-col items-center">
      {/* Pokémon Header */}
      <PokemonHeader pokemon={pokemon} />

      {/* Stats */}
      <div className="mt-8 w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Base Stats</h3>
        <div className="space-y-3">
          {animatedStats.map((stat) => (
            <ProgressBar key={stat.name} label={stat.name} value={stat.value} />
          ))}
        </div>
      </div>

      {/* Abilities */}
      <Abilities abilities={pokemon.abilities} />

      {/* Evolution Chain */}
      {evolution.length > 1 && <EvolutionChain evolution={evolution} />}
    </div>
  );
}

// ==================== Sub Components ==================== //

function PokemonHeader({ pokemon }: { pokemon: any }) {
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
      <img
        src={pokemon.image || "/placeholder.png"}
        alt={pokemon.name}
        className="w-64 h-64 object-contain"
      />
      <h2 className="text-4xl font-bold capitalize mt-4">{pokemon.name}</h2>
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        {pokemon.types.map((type: string) => (
          <span
            key={type}
            className={`px-3 py-1 rounded-full text-sm text-white capitalize ${
              typeColors[type] || "bg-gray-400"
            }`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

function Abilities({ abilities }: { abilities: { name: string; is_hidden: boolean }[] }) {
  return (
    <div className="mt-6 w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-3">Abilities</h3>
      <div className="flex gap-2 flex-wrap">
        {abilities.map((ab) => (
          <span
            key={ab.name}
            className={`px-3 py-1 rounded-full text-sm text-white capitalize ${
              ab.is_hidden ? "bg-gray-500" : "bg-indigo-500"
            }`}
            title={ab.is_hidden ? "Hidden Ability" : "Normal Ability"}
          >
            {ab.name.replace("-", " ")}
          </span>
        ))}
      </div>
    </div>
  );
}

function EvolutionChain({ evolution }: { evolution: any[] }) {
  return (
    <div className="mt-8 w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-3">Evolution Chain</h3>
      <div className="flex gap-4 justify-center items-center flex-wrap">
        {evolution.map((p, idx) => (
          <div key={p.id} className="flex flex-col items-center">
            <Link to={`/pokemon/${p.id}`}>
              <img
                src={p.image || "/placeholder.png"}
                alt={p.name}
                className="w-32 h-32 object-contain"
              />
              <span className="capitalize mt-1 text-center">{p.name}</span>
            </Link>
            {idx < evolution.length - 1 && <span className="text-2xl mt-2">➡️</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  const percent = Math.min(value, 150);
  const color = getStatColor(label);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1 capitalize">
        <span>{label.replace("-", " ")}</span>
        <span className="font-semibold">{Math.round(value)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="h-4 rounded-full transition-all duration-500"
          style={{ width: `${(percent / 150) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function getStatColor(stat: string) {
  const colors: Record<string, string> = {
    hp: "#ef4444",
    attack: "#f97316",
    defense: "#3b82f6",
    "special-attack": "#8b5cf6",
    "special-defense": "#10b981",
    speed: "#facc15",
  };
  return colors[stat] || "#9ca3af";
}
