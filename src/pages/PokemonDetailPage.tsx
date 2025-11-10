import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePokemon } from "../context/PokemonContext";
import { typeColors } from "../constants/pokemonTypeColors";

type Stat = { name: string; value: number };

export default function PokemonDetailPage() {
  const { id } = useParams();
  const { getPokemonWithEvolutionById } = usePokemon();
  const [pokemon, setPokemon] = useState<any>(null);
  const [evolution, setEvolution] = useState<any[]>([]);
  const [animatedStats, setAnimatedStats] = useState<Stat[]>([]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { pokemon, evolution } = await getPokemonWithEvolutionById(
        Number(id)
      );
      setPokemon(pokemon);
      setEvolution(evolution);

      if (pokemon) {
        setAnimatedStats(pokemon.stats.map((s: Stat) => ({ ...s, value: 0 })));
        // Animate
        pokemon.stats.forEach((s: Stat, idx: number) => {
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
      }
    })();
  }, [id, getPokemonWithEvolutionById]);

  if (!pokemon)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading Pokémon...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-64 h-64 object-contain"
        />
        <h2 className="text-4xl font-bold capitalize mt-4">{pokemon.name}</h2>
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          {pokemon.types.map((type: string) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-sm text-white capitalize ${typeColors[type] || "bg-gray-400"}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">Base Stats</h3>
        <div className="space-y-3">
          {animatedStats.map((stat: Stat) => (
            <ProgressBar key={stat.name} label={stat.name} value={stat.value} />
          ))}
        </div>
      </div>

      {/* Abilities */}
      <div className="mt-6 w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-3">Abilities</h3>
        <div className="flex gap-2 flex-wrap">
          {pokemon?.abilities?.map(
            (ab: { name: string; is_hidden: boolean }) => (
              <span
                key={ab.name}
                className={`px-3 py-1 rounded-full text-sm text-white capitalize ${
                  ab.is_hidden ? "bg-gray-500" : "bg-indigo-500"
                }`}
                title={ab.is_hidden ? "Hidden Ability" : "Normal Ability"}
              >
                {ab.name.replace("-", " ")}
              </span>
            )
          )}
        </div>
      </div>

      {/* Evolution Chain */}
      {evolution.length > 1 && (
        <div className="mt-8 w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-3">Evolution Chain</h3>
          <div className="flex gap-4 justify-center items-center flex-wrap">
            {evolution.map((p, idx) => (
              <div key={p.id} className="flex flex-col items-center">
                <Link to={`/pokemon/${p.id}`}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-32 h-32 object-contain"
                  />
                  <span className="capitalize mt-1 text-center">{p.name}</span>
                </Link>
                {idx < evolution.length - 1 && (
                  <span className="text-2xl mt-2">➡️</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Progress bar component
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

// สี stat ตามประเภท
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

// สี type Pokémon
// function getTypeColor(type: string) {
//   const colors: Record<string, string> = {
//     fire: "#F08030",
//     water: "#6890F0",
//     grass: "#78C850",
//     electric: "#F8D030",
//     ice: "#98D8D8",
//     fighting: "#C03028",
//     poison: "#A040A0",
//     ground: "#E0C068",
//     flying: "#A890F0",
//     psychic: "#F85888",
//     bug: "#A8B820",
//     rock: "#B8A038",
//     ghost: "#705898",
//     dragon: "#7038F8",
//     dark: "#705848",
//     steel: "#B8B8D0",
//     fairy: "#EE99AC",
//   };
//   return colors[type] || "#A8A878";
// }
