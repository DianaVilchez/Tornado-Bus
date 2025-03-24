import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SearchResults from "./components/SearchResults";
import MainView from "./components/MainView";
import TravelDetails from "./components/TravelDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/details" element={<TravelDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
