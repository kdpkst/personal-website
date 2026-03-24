import { useEffect, useRef } from "react";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function createNoiseBuffer(context: AudioContext, duration: number) {
  const buffer = context.createBuffer(
    1,
    context.sampleRate * duration,
    context.sampleRate,
  );
  const channel = buffer.getChannelData(0);

  for (let index = 0; index < channel.length; index += 1) {
    channel[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

export default function AmbientAudio() {
  const startedRef = useRef(false);

  useEffect(() => {
    const AudioContextConstructor =
      window.AudioContext ?? window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    let context: AudioContext | null = null;
    let cleanup: (() => void) | null = null;

    const startAudio = async () => {
      if (startedRef.current) {
        return;
      }

      startedRef.current = true;
      context = new AudioContextConstructor();
      await context.resume();

      const master = context.createGain();
      master.gain.value = 0.08;
      master.connect(context.destination);

      const windSource = context.createBufferSource();
      windSource.buffer = createNoiseBuffer(context, 2.4);
      windSource.loop = true;

      const windLowpass = context.createBiquadFilter();
      windLowpass.type = "lowpass";
      windLowpass.frequency.value = 580;

      const windHighpass = context.createBiquadFilter();
      windHighpass.type = "highpass";
      windHighpass.frequency.value = 120;

      const windGain = context.createGain();
      windGain.gain.value = 0.05;

      const lfo = context.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.07;

      const lfoDepth = context.createGain();
      lfoDepth.gain.value = 140;
      lfo.connect(lfoDepth);
      lfoDepth.connect(windLowpass.frequency);

      windSource.connect(windLowpass);
      windLowpass.connect(windHighpass);
      windHighpass.connect(windGain);
      windGain.connect(master);

      const rustleSource = context.createBufferSource();
      rustleSource.buffer = createNoiseBuffer(context, 1.1);
      rustleSource.loop = true;

      const rustleBandpass = context.createBiquadFilter();
      rustleBandpass.type = "bandpass";
      rustleBandpass.frequency.value = 1400;
      rustleBandpass.Q.value = 0.7;

      const rustleGain = context.createGain();
      rustleGain.gain.value = 0;

      rustleSource.connect(rustleBandpass);
      rustleBandpass.connect(rustleGain);
      rustleGain.connect(master);

      const rustleTimer = window.setInterval(() => {
        if (!context) {
          return;
        }

        const now = context.currentTime;
        rustleGain.gain.cancelScheduledValues(now);
        rustleGain.gain.setValueAtTime(rustleGain.gain.value, now);
        rustleGain.gain.linearRampToValueAtTime(0.028, now + 0.18);
        rustleGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);
      }, 5200);

      windSource.start();
      rustleSource.start();
      lfo.start();

      cleanup = () => {
        window.clearInterval(rustleTimer);
        lfo.stop();
        windSource.stop();
        rustleSource.stop();
        void context?.close();
      };
    };

    const handleFirstInteraction = () => {
      void startAudio();
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      cleanup?.();
    };
  }, []);

  return null;
}
