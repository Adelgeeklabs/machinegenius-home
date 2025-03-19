import { useEffect, useRef, useState, memo } from "react";
import styles from "./VoiceRecorder.module.css";
import toast from "react-hot-toast";

interface VoiceRecorderProps {
  onClose: () => void;
  onSave: (audioBlob: Blob, duration: number) => void;
}

const VoiceRecorder = ({ onClose, onSave }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Error accessing microphone");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleSave = () => {
    if (chunksRef.current.length > 0) {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
      onSave(audioBlob, duration);
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Voice Message</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.waveform}>
            {isRecording && (
              <div className={styles.visualizer}>
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={styles.bar}
                    style={{
                      animationPlayState: isPaused ? "paused" : "running",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}
            {audioUrl && (
              <audio src={audioUrl} controls className={styles.audioPlayer} />
            )}
          </div>

          <div className={styles.timer}>{formatTime(duration)}</div>

          <div className={styles.controls}>
            {!isRecording && !audioUrl && (
              <button onClick={startRecording} className={styles.recordButton}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <circle cx="12" cy="12" r="8" fill="currentColor" />
                </svg>
                Start Recording
              </button>
            )}

            {isRecording && (
              <>
                {!isPaused ? (
                  <button
                    onClick={pauseRecording}
                    className={styles.controlButton}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={resumeRecording}
                    className={styles.controlButton}
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={stopRecording}
                  className={styles.controlButton}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M6 6h12v12H6z" />
                  </svg>
                </button>
              </>
            )}

            {audioUrl && (
              <div className={styles.actionButtons}>
                <button
                  onClick={() => {
                    setAudioUrl(null);
                    setDuration(0);
                    chunksRef.current = [];
                    startRecording();
                  }}
                  className={styles.retryButton}
                >
                  Retry
                </button>
                <button onClick={handleSave} className={styles.saveButton}>
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(VoiceRecorder);
