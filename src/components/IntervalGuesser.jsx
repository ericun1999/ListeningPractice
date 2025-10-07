import React, { useState, useEffect, useRef } from 'react';
import { transpose, note } from '@tonaljs/tonal';
import { Howl } from 'howler';
import pianosprite from '../assets/pianosprite.mp3'

const IntervalGuesser = ({ intervals }) => {
  const [currentInterval, setCurrentInterval] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [notes, setNotes] = useState([]);
  const [intervalStr, setIntervalStr] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [pianosprite],
      onload() {
        console.log('Sound file loaded');
        initSprites();
        setIsLoaded(true);
      },
      onloaderror(id, error) {
        console.error('Sound load error:', id, error);
      },
    });

    const initSprites = () => {
      const lengthOfNote = 2400;
      let timeIndex = 0;
      for (let i = 24; i <= 96; i++) {
        soundRef.current['_sprite'][i] = [timeIndex, lengthOfNote];
        timeIndex += lengthOfNote;
      }
    };

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const generateRandomInterval = () => {
    const randomRootIndex = Math.floor(Math.random() * startNotes.length);
    const randomIntervalIndex = Math.floor(Math.random() * intervals.length);
    const randomOctave = octaves[Math.floor(Math.random() * octaves.length)];

    const root = startNotes[randomRootIndex];
    const intervalData = intervals[randomIntervalIndex];
    const interval = intervalData[0]; // e.g., "3M"
    const fullName = intervalData[1]; // e.g., "major third"
    const abrevs = intervalData[2]; // e.g., "M3 3"

    const startNoteWithOctave = root + randomOctave;
    const secondNote = transpose(startNoteWithOctave, interval);
    const intervalNotes = [startNoteWithOctave, secondNote];

    setCurrentInterval(fullName);
    setNotes(intervalNotes);
    setIntervalStr(interval);
    setShowAnswer(false);
    playInterval(intervalNotes);
  };

  const playInterval = (intervalNotes) => {
    if (!isLoaded || !soundRef.current) return;
    const midiNumbers = intervalNotes.map(noteName => note(noteName).midi);
    soundRef.current.volume(0.75);
    midiNumbers.forEach(midi => {
      console.log(midi);
      soundRef.current.play(midi.toString());
    });
  };

  const playBrokenInterval = (intervalNotes) => {
    if (!isLoaded || !soundRef.current) return;
    const midiNumbers = intervalNotes.map(noteName => note(noteName).midi);
    soundRef.current.volume(0.75);
    let delay = 0;
    midiNumbers.forEach(midi => {
      setTimeout(() => {
        soundRef.current.play(midi.toString());
      }, delay);
      delay += 300; // 300ms between notes
    });
  };

  useEffect(() => {
    if (isLoaded) {
      generateRandomInterval();
    }
  }, [isLoaded, intervals]);

  const startNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
  const octaves = [2, 3]; // Adjusted for better range with intervals

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Interval Guessing Practice</h1>
        
        <div className="mb-6 space-y-2">
          <button
            onClick={() => playInterval(notes)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Play Again
          </button>
          <button
            onClick={() => playBrokenInterval(notes)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Play Sequential
          </button>
        </div>

        {!showAnswer ? (
          <div className="mb-6">
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Show Answer
            </button>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{currentInterval}</p>
            <p className="text-lg font-mono text-gray-600 mb-2">Notes: {notes.join(' to ')}</p>
            <p className="text-sm text-gray-500">Interval: {intervalStr}</p>
          </div>
        )}

        <button
          onClick={generateRandomInterval}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          disabled={!isLoaded}
        >
          Next Interval
        </button>

        {!isLoaded && (
          <p className="text-center text-gray-500 mt-4">Loading sounds...</p>
        )}
      </div>
    </div>
  );
};

export default IntervalGuesser;