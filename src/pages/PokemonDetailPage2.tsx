import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePokemon } from "../context/PokemonContext";

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const { getPokemonById } = usePokemon();
  const [pokemon, setPokemon] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getPokemonById(Number(id));
      setPokemon(data);
    })();
  }, [id]);

  if (!pokemon) return <div className="p-4 text-center">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="p-6 text-center">
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="mx-auto w-64 h-64 object-contain"
      />
      <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
      <div className="flex justify-center gap-2 mt-3">
        {pokemon.types.map((t: string) => (
          <span key={t} className="px-3 py-1 bg-gray-200 rounded-full capitalize">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
