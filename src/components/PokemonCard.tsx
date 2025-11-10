import { Link } from "react-router-dom";
import { typeColors } from "../constants/pokemonTypeColors";

type PokemonCardProps = {
  pokeId: number;
  name: string;
  image: string;
  pokeType: string[];
  link: string;
};

export default function PokemonCard({
  pokeId,
  name,
  image,
  pokeType,
  link,
}: PokemonCardProps) {
  // show id
  const displayId = pokeId.toString().padStart(4, "0");

  return (
    <Link to={link} className="block p-4">
      <img src={image} alt={name} className="w-full h-40 object-contain" />
      <h3 className="mt-2 text-lg font-bold capitalize">{displayId} : {name}</h3>
      <div className="flex gap-1 flex-wrap mt-1">
        {pokeType.map((type) => (
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
    </Link>
  );
}
