import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { transpose, note } from '@tonaljs/tonal';
import { chord } from '@tonaljs/chord';

const CHORDS = [
  // ==Major==
  ["1P 3M 5P", "major", "M ^  maj"],
  ["1P 3M 5P 7M", "major seventh", "maj7 Δ ma7 M7 Maj7 ^7"],
  // ==Minor==
  // '''Normal'''
  ["1P 3m 5P", "minor", "m min -"],
  ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
  [
    "1P 3m 5P 7M",
    "minor/major seventh",
    "m/ma7 m/maj7 mM7 mMaj7 m/M7 -Δ7 mΔ -^7 -maj7",
  ]
  // '''Diminished'''
  ["1P 3m 5d", "diminished", "dim ° o"],
  ["1P 3m 5d 7m", "half-diminished", "m7b5 ø -7b5 h7 h"],
  // ==Dominant/Seventh==
  // '''Normal'''
  ["1P 3M 5P 7m", "dominant seventh", "7 dom"],


  // '''Suspended'''
  ["1P 4P 5P", "suspended fourth", "sus4 sus"],
  ["1P 2M 5P", "suspended second", "sus2"],
  // ==Other==
  ["1P 5P", "fifth", "5"],
  ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
];

const startNotes = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
const octaves = [2];

const ChordGuesser = () => {
  const [currentChord, setCurrentChord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [notes, setNotes] = useState([]);
  const [intervals, setIntervals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth().toDestination();
    setIsLoaded(true);

    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  const generateRandomChord = () => {
    const randomRootIndex = Math.floor(Math.random() * startNotes.length);
    const randomChordIndex = Math.floor(Math.random() * CHORDS.length);
    const randomOctave = octaves[Math.floor(Math.random() * octaves.length)];

    const root = startNotes[randomRootIndex];
    const chordData = CHORDS[randomChordIndex];
    const abrv = chordData[2].split(' ')[0]; // First abbreviation
    const fullName = chordData[1];
    const symbol = root + abrv;
    const chordFullName = root + ' ' + (fullName || abrv);

    let chordIntervals;
    try {
      chordIntervals = chord(symbol).intervals;
    } catch (e) {
      // Fallback if symbol invalid, regenerate
      return generateRandomChord();
    }

    const startNoteWithOctave = root + randomOctave;
    const chordNotes = chordIntervals.map(interval => transpose(startNoteWithOctave, interval));

    setCurrentChord(chordFullName);
    setNotes(chordNotes);
    setIntervals(chordIntervals);
    setShowAnswer(false);
    playChord(chordNotes);
  };

  const playChord = (chordNotes) => {
    if (!isLoaded || !synthRef.current) return;
    Tone.start(); // Ensure audio context is started
    synthRef.current.triggerAttackRelease(chordNotes, '8n');
  };

  useEffect(() => {
    if (isLoaded) {
      generateRandomChord();
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Chord Guessing Practice</h1>
        
        <div className="mb-6">
          <button
            onClick={() => playChord(notes)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Play Again
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
            <p className="text-3xl font-bold text-purple-600">{currentChord}</p>
            <p className="text-lg font-mono text-gray-600 mb-2">Notes: {notes.join(' - ')}</p>
            <p className="text-sm text-gray-500">Intervals: {intervals.join(' - ')}</p>
          </div>
        )}

        <button
          onClick={generateRandomChord}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          disabled={!isLoaded}
        >
          Next Chord
        </button>

        {!isLoaded && (
          <p className="text-center text-gray-500 mt-4">Loading sounds...</p>
        )}
      </div>
    </div>
  );
};

export default ChordGuesser;