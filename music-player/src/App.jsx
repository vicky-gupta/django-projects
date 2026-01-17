import { MusicPlayer } from "./components/MusicPlayer";
import { AllSongs } from "./components/Allsongs";
import { Playlists } from "./components/Playlists";
import { MusicProvider } from "./contexts/MusicContexts";

import { BrowserRouter, Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
function App() {


  return (
    <BrowserRouter>
    <MusicProvider>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <div className="player-section">
            <MusicPlayer />
          </div>
          <div className="content-section">
            <Routes>
              <Route path="/" element={<AllSongs/>} />
              <Route path="/Playlists" element={<Playlists/>} />
              <Route path="/contact" element={<div>Contact Page Content</div>} />
            </Routes>
          </div>
        </main>

      </div>
      </MusicProvider>
    </BrowserRouter>
  );
}

export default App;