import { useEffect, useRef, useState, memo } from "react";
import styles from "./VoiceMessage.module.css";

interface VoiceMessageProps {
  url: string;
  isUser?: boolean;
  calcDuration: number;
}

const formatedTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VoiceMessage = ({ url, isUser, calcDuration }: VoiceMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(calcDuration);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  function getAudioDuration(audioPath: string | undefined): Promise<number> {
    if (!audioPath) return Promise.resolve(0);

    return new Promise((resolve, reject) => {
      const audio = new Audio();

      const handleSuccess = () => {
        console.log("audio duration found", audio.duration);
        if (audio.duration && !isNaN(audio.duration)) {
          resolve(audio.duration);
        } else {
          console.warn("Invalid duration for:", audioPath);
          reject(new Error("Invalid duration"));
        }
      };

      const handleError = (e: ErrorEvent) => {
        console.error("Error loading audio:", audioPath, e);
        reject(new Error("Error loading audio"));
      };

      audio.addEventListener("loadedmetadata", handleSuccess, { once: true });
      audio.addEventListener("error", handleError, { once: true });

      // Set source after adding listeners
      audio.src = audioPath;
      audio.load(); // Explicitly load the audio
    });
  }

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleLoadedMetadata = async () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(await getAudioDuration(url));
          setIsLoading(false);
        }
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime || 0);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      // Handle the case where the audio is already loaded
      if (audio.readyState >= 2) {
        handleLoadedMetadata();
      }

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  useEffect(() => {
    console.log("calcDuration", calcDuration);
  }, [calcDuration]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = (percentage * calcDuration) as number;
      console.log("newTime", newTime);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div className={`${styles.voiceMessage} ${isUser ? styles.user : ""}`}>
      <audio ref={audioRef} src={url} preload="metadata" />

      <button
        onClick={togglePlay}
        className={styles.playButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner} />
        ) : isPlaying ? (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className={styles.progressContainer}>
        <div
          ref={progressRef}
          className={styles.progressBar}
          onClick={handleProgressClick}
        >
          <div
            className={styles.progress}
            style={{
              width: `${calcDuration ? ((currentTime / calcDuration) as number) * 100 : 0}%`,
            }}
          />
        </div>
        <div className={styles.time}>
          {formatTime(currentTime)} /{" "}
          {calcDuration ? formatedTime(calcDuration) : "0:00"}
        </div>
      </div>
    </div>
  );
};

export default memo(VoiceMessage);
