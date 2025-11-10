import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PokemonProvider } from "./context/PokemonContext";
import Header from "./components/Header";
import PokemonLists from "./pages/PokemonListsPage";
import PokemonDetail from "./pages/PokemonDetailPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <PokemonProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<PokemonLists />} />
          <Route path="/pokemon/:id" element={<PokemonDetail />} />
        </Routes>
      </BrowserRouter>
    </PokemonProvider>
  );
};

export default App;
