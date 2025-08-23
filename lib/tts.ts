"use client";

function summarize(text: string, maxSentences = 2): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length <= maxSentences) return text;

  const freq: Record<string, number> = {};
  const stopWords = ["the","is","and","a","to","in","of","का","की","और","है","में"];

  text.toLowerCase().split(/\W+/).forEach(word => {
    if (!stopWords.includes(word) && word.length > 2) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  const scored = sentences.map(s => {
    let score = 0;
    s.toLowerCase().split(/\W+/).forEach(word => {
      if (freq[word]) score += freq[word];
    });
    return { sentence: s.trim(), score };
  });

  const top = scored.sort((a, b) => b.score - a.score).slice(0, maxSentences);
  return top.map(s => s.sentence).join(" ");
}

export function summarizeAndSpeakHindi(
  text: string,
  opts?: { rate?: number; pitch?: number; voice?: string }
) {
  if (typeof window === "undefined") return;

  const summary = summarize(text, 2);
  speak(summary, { ...opts, voice: opts?.voice ?? "Google हिन्दी" });

  return summary;
}

export function speak(
  text: string,
  opts?: { rate?: number; pitch?: number; voice?: string }
) {
  if (typeof window === "undefined") return;

  if (!("speechSynthesis" in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = opts?.rate ?? 1;
  utterance.pitch = opts?.pitch ?? 1;

  if (opts?.voice) {
    const voices = window.speechSynthesis.getVoices();
    const selected = voices.find((v) => v.name === opts.voice);
    if (selected) utterance.voice = selected;
  }

  window.speechSynthesis.speak(utterance);
}

// ✅ Stop
export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
}

// ✅ Pause
export function pauseSpeaking() {
  if (typeof window === "undefined") return;
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  }
}

// ✅ Resume
export function resumeSpeaking() {
  if (typeof window === "undefined") return;
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}
