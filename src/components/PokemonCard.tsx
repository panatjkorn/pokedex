import { useNavigate } from "react-router-dom";
import { typeColors } from "../constants/pokemonTypeColors";

type PokemonCardProps = {
  pokeId: number
  name: string
  image: string
  pokeType : string[]
}

export default function PokemonCard({ pokeId, name, image, pokeType }: PokemonCardProps) {
  const navigate = useNavigate();
  const handleToPokemonDetail = () => {
    navigate(`/pokemon/${pokeId}`);
  };
  return (
    <div 
      className="flex-1 min-w-[220px] max-w-[250px] bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleToPokemonDetail}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-contain bg-gray-100"
      />
      <div className="p-4 text-center">
        <h3 className="font-semibold text-lg capitalize">{pokeId} : {name}</h3>
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          {pokeType.map((type) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-sm text-white capitalize ${typeColors[type] || "bg-gray-400"}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
