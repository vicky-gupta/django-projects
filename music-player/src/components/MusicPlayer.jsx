import { useMusic } from "../contexts/MusicContexts";
import { useRef, useEffect } from 'react';

export const MusicPlayer = () => {
    const {currentTrack, formatTime, setCurrentTime, currentTime, duration, setDuration, nextTrack, prevTrack, play, pause, isPlay, volume, setVolume } = useMusic();
    const audioRef = useRef(null);

    const handleTimeChange = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newTime = parseFloat(e.target.value);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
};

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = volume;
    }, [volume]); 

    // Effect 1: Handle Play/Pause
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        if (isPlay) {
            audio.play().catch((error) => console.error("Playback error:", error));
        } else {
            audio.pause();
        }
    }, [isPlay]); 

    // Effect 2: Handle Track Loading and Events
    useEffect(() => {
        const audio = audioRef.current;
        if(!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            // Auto-play if we are in "playing" state when song changes
            if (isPlay) {
                audio.play().catch(e => console.error("Auto-play error", e));
            }
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            nextTrack();
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("canplay", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);

        // Load the new source
        audio.load();

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("canplay", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
        };
        
    }, [currentTrack, setDuration]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.load();
    }, [currentTrack, setDuration]);


    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
    <div className="music-player">
        <audio ref={audioRef} src={currentTrack.url} preload="metadata" crossOrigin="anonymous"/>
        <div className="track-info">
            <h3 className="track-title">{currentTrack.title}</h3>
            <p className="track-artist">{currentTrack.artist}</p>
        </div>
        <div className='progress-container'>
            <span className="time">{formatTime(currentTime)}</span>
            <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                step="0.1" 
                value={currentTime || 0} 
                className="progress-bar" 
                // Added seeking ability
                onChange={handleTimeChange}
                style={{"--progress": `${progressPercentage}%`}}
            />
            <span className="time">{formatTime(duration)}</span>
        </div>
        <div className='controls'>
            <button className='control-btn' onClick={prevTrack}>⏮</button>
            <button className='control-btn play-btn' onClick={() => (isPlay ? pause() : play())}> {isPlay ? "⏸" : "▶"}</button>
            <button className='control-btn' onClick={nextTrack}>⏭</button>
        </div>
        <div className="volume-container">
            <span className="volume-icon">🕪</span>
            <input type="range" min="0" max="1" step="0.01" className="volume-bar" onChange={handleVolumeChange}/>
        </div>
    </div>
    );
};