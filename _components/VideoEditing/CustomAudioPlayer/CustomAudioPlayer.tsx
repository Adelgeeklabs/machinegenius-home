"use client";
import React from "react";
import "./CustomAudioPlayer.css";
import dynamic from "next/dynamic";

const AudioPlayer = dynamic(() => import("react-h5-audio-player"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center rounded-lg bg-[#fffffb] h-full">
      <span className="custom-loader"></span>
    </div>
  ),
});

const CustomAudioPlayer = ({ audioSrc }: { audioSrc: string }) => {
  return (
    <AudioPlayer
      src={audioSrc}
      // onPlay={(e) => console.log("onPlay")}
      autoPlayAfterSrcChange={true}
      // other props here
      className="custom_audio_player"
    />
  );
};

export default CustomAudioPlayer;
