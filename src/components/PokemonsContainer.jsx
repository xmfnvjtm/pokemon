import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";
import { formatPokemonData } from "../utils/pokemon-helper";
import Loader from "./Loader";

const PokemonsContainer = ({ type }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const API_END_POINT = `https://pokeapi.co/api/v2/type/${type}`;
      const response = await fetch(API_END_POINT);
      const data = await response.json();

      const { pokemon: pokemonList } = data;
      const temp = pokemonList.map(async (item) => {
        const response = await fetch(item.pokemon.url);
        const data = await response.json();
        return formatPokemonData(data);
      });

      const result = await Promise.all(temp);
      setPokemons(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [type]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pokemons-container">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonsContainer;