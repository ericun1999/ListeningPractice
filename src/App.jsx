import React, { useState } from 'react';
import Piano from './components/Piano';
import ChordGuesser from './components/ChordGuesser';
import IntervalGuesser from './components/IntervalGuesser';
import { Chord1, Chord2, Chord3, Intervals } from './data/data';

function App() {
  const [selectedGroup, setSelectedGroup] = useState('Major Minor Suspended Augmented');

  const chordSets = {
    'Major Minor Suspended Augmented': Chord1,
    'Major Minor Suspended Augmented Diminished': Chord2,
    'Seventh': Chord3,
    'Intervals': Intervals
  };

  const currentSet = chordSets[selectedGroup];

  const isIntervals = selectedGroup === 'Intervals';

  return (
    <div>
      <div>
        <Piano />
      </div>
      <div> 
        <div className="flex justify-center bg-green-50 pt-5">
          <div className="p-4 max-w-6xs border-2 bg-green-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Chord Group:
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="text-black block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {Object.keys(chordSets).map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-600">
              Current: {currentSet.group}
            </p>
          </div>
        </div>
        {isIntervals ? (
          <IntervalGuesser intervals={currentSet.intervals} />
        ) : (
          <ChordGuesser chords={currentSet.chords} />
        )}
      </div>
    </div>
  );
}

export default App;