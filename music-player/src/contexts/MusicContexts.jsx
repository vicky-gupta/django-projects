import { createContext, useContext, useEffect, useState } from "react";

const MusicContexts = createContext();

const songs = [
    {
        id: 1,
        title: "eguitar",
        artist: "Artist A",
        url: "/eguitar.mp3",
        duration: "0:52"

    },
        {  
        id: 2,
        title: "freestyle",
        artist: "Artist B",
        url: "/freestyle.mp3",
        duration: "2:54"

    },
        {
        id: 3,
        title: "party",
        artist: "Artist C",
        url: "/party.mp3",
        duration: "1:44"

    },
    {
        id: 4,
        title: "drop",
        artist: "Artist D",
        url: "/drop.mp3",
        duration: "2:35"

    },
];

export const MusicProvider = ({ children }) => {

    const [allSongs, setAllSongs] = useState(songs);
    const [currentTrack, setCurrentTrack] = useState(songs[0]);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlay, setIsPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [playlists, setPlaylists] = useState([]);


    useEffect(() => {
        const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
        if (savedPlaylists) {
           const playlists = JSON.parse(savedPlaylists);
           setPlaylists(playlists);
        }
    }, []);

    useEffect(() => {
     if (playlists.length > 0) {
        localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
     } else {
        localStorage.removeItem("musicPlayerPlaylists");
     }
    }, [playlists]);


    useEffect(() => {
    setCurrentTrack(allSongs[currentTrackIndex] || { title: "", artist: "", url: "" });
    setCurrentTime(0);
  }, [currentTrackIndex, allSongs]);

    const handlePlaySong = (song, index) => {
        setCurrentTrack(song);
        setCurrentTrackIndex(index);
        setIsPlay(false);
    };

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = (prev + 1) % allSongs.length;
            setCurrentTrack(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlay(false);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => {
            const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
            setCurrentTrack(allSongs[nextIndex]);
            return nextIndex;
        });
        setIsPlay(false);
    };
    

    const formatTime = (time) => {
        if (isNaN(time) || time === undefined || time === null) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const createPlaylist = (name) => {
        const newPlaylist = {
            id: Date.now(),
            name,
            songs: [],
        };
        setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
    };

    const deletePlaylist = (playlistId) => {
        setPlaylists((prev) =>
            prev.filter((playlist) => playlist.id !== playlistId)
        );
    }

    const addSongToPlaylist = (playlistId, song) => {
        setPlaylists((prev) =>
            prev.map((playlist) =>{
                if (playlist.id === playlistId)
                {
                    return { ...playlist, songs: [...playlist.songs, song]};
                } else {
                    return playlist;
                }
            })
    );
    };

    const play = () => setIsPlay(true);
    const pause = () => setIsPlay(false);
    return (<MusicContexts.Provider value={{ allSongs, currentTrack, setCurrentTrack, currentTrackIndex, currentTime, duration, isPlay, volume, setVolume, handlePlaySong, nextTrack, prevTrack, formatTime, play, pause, setCurrentTime, setDuration, playlists, createPlaylist, addSongToPlaylist, deletePlaylist }}>{children}</MusicContexts.Provider>);
}

export const useMusic = () => {
    const contextValue = useContext(MusicContexts);
    if (!contextValue) {
        throw new Error("useMusic must be used within a MusicProvider");
    }
    return contextValue;
};