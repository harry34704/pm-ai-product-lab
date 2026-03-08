"use client";

import { useEffect, useRef, useState } from "react";

type RecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

export function useSpeechTranscription(onChunk: (text: string) => void) {
  const recognitionRef = useRef<RecognitionType | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const chunk = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result: any) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (chunk) {
        onChunk(chunk);
      }
    };
    recognition.onerror = () => setIsActive(false);
    recognition.onend = () => setIsActive(false);
    recognitionRef.current = recognition;
    setIsSupported(true);
  }, [onChunk]);

  function start() {
    recognitionRef.current?.start();
    setIsActive(true);
  }

  function stop() {
    recognitionRef.current?.stop();
    setIsActive(false);
  }

  return { isSupported, isActive, start, stop };
}
