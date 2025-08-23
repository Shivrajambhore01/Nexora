"use client";

import React, { useState, useEffect } from "react";
import VoiceControls from "./voice-controls";
import { speak, stopSpeaking, pauseSpeaking, resumeSpeaking } from "../../lib/tts";

interface AudioPlayerProps {
  rate?: number;
  pitch?: number;
  voice?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  rate = 1,
  pitch = 1,
  voice,
}) => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleSpeak = () => {
    if (!text.trim()) {
      alert("Please enter some text!");
      return;
    }
    stopSpeaking();
    speak(text, { rate, pitch, voice });
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    pauseSpeaking();
    setIsPaused(true);
  };

  const handleResume = () => {
    resumeSpeaking();
    setIsPaused(false);
  };

  const handleStop = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Text to Speech
      </h2>
      <textarea
        className="w-full min-h-[100px] rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Enter text to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-4">
        <VoiceControls
          isSpeaking={isSpeaking}
          isPaused={isPaused}
          onStart={handleSpeak}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
