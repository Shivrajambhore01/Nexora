"use client";

import React from "react";

interface VoiceControlsProps {
  isSpeaking: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  isSpeaking,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  return (
    <div className="flex gap-2 mt-2">
      {!isSpeaking ? (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ▶ Speak
        </button>
      ) : (
        <>
          {!isPaused ? (
            <button
              onClick={onPause}
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              ⏸ Pause
            </button>
          ) : (
            <button
              onClick={onResume}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              ▶ Resume
            </button>
          )}
          <button
            onClick={onStop}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            ⏹ Stop
          </button>
        </>
      )}
    </div>
  );
};

export default VoiceControls;
