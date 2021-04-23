import { is } from "date-fns/locale";
import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping:boolean
  isShuffle:boolean
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleIsShuffle: () => void;
  playNext : () => void;
  playPrevious: () => void;
  clearPlayerState : () => void;
  hasNext: boolean;
  hasPrevious:boolean
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);


  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }


  function toggleIsShuffle() {
    setIsShuffle(!isShuffle);
  }


  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

function clearPlayerState() {

  setEpisodeList ([]);
  setCurrentEpisodeIndex(0)

}







  const hasNext = isShuffle || (currentEpisodeIndex + 1) < episodeList.length
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {

    if(isShuffle) {

      const nextRandomEpisodeIndex = Math.floor(Math.random() + episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)

    } else if (hasNext)  {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);

    }

    }
  

  function playPrevious() {
    if (hasPrevious ) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        isPlaying,
        playNext,
        isLooping,
        isShuffle,
        toggleLoop,
        playPrevious,
        togglePlay,
        setPlayingState,
        hasNext,
        hasPrevious,
        toggleIsShuffle,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}
