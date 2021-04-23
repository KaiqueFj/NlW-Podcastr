import {  useRef, useEffect, useState } from "react";
import {  usePlayer } from "../../contexts/PlayerContext";
import Image from "next/image";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";
import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress,setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isShuffle,
    isPlaying,
    isLooping,
    toggleLoop,
    togglePlay,
    toggleIsShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayerState,
    hasNext,
    hasPrevious,
  } = usePlayer(); 

  useEffect(() => {
    if (audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {

    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))

    });

  }

  function handleSeek(amount:number) {

    audioRef.current.currentTime = amount
    setProgress(amount);
  }

  function  handleEpisodeEnded () {
    if(hasNext) {
      playNext()
    } else {
      clearPlayerState()

    }

  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"></img>
        <strong> Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString (progress)}</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider

              max={episode.duration}
              value={progress}
              onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }} //color of progession in slider
                railStyle={{ backgroundColor: "#9f75ff" }} //color of unlisten slider
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString (episode?.duration ?? 0)}</span>
        </div>

       {episode && (
         <audio 

         src = {episode.url}
         ref = {audioRef}
         autoPlay
         onEnded ={handleEpisodeEnded}
         loop= {isLooping}
         onPlay = {()=> setPlayingState(true)}
         onPause = {()=> setPlayingState(true)}
         onLoadedMetadata={setupProgressListener}

        
         />
       )}


        <div className={styles.Buttons}>
          <button
           type="button" 
           disabled={!episode ||   episodeList.length == 1}
           onClick= {toggleIsShuffle}
           className={isShuffle ? styles.isActive : ''}
          
          
          >
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>

          <button type="button"  onClick= {playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="tocar anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {" "}
            <img src="/play.svg" alt="tocar" />
            {isPlaying ? (
              <img src="/pause.svg" alt="pause" />
            ) : (
              <img src="/play.svg" alt="tocar" />
            )}
          </button>

          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="tocar proxima" />
          </button>

          <button type="button"
           disabled={!episode}
           onClick= {toggleLoop}
           className={isLooping ? styles.isActive : ''}
           >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
