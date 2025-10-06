import * as Tone from 'tone';

function Piano() {
  // Define base notes and types for one octave
  const baseNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const types = ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'];

  // Generate notes for 3 octaves (C3 to B5)
  const notes = [];
  for (let octave = 3; octave <= 5; octave++) {
    for (let i = 0; i < 12; i++) {
      notes.push({
        note: `${baseNotes[i]}${octave}`,
        type: types[i]
      });
    }
  }

  // Initialize Tone.js Synth
  const synth = new Tone.Synth().toDestination();

  // Function to play a note
  const playNote = (note) => {
    Tone.start(); // Ensure audio context is started
    synth.triggerAttackRelease(note, '8n');
  };

  return (
    <div className="flex flex-col items-center bg-green-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">listening practice</h1>
      <div className="relative flex">
        {/* Render white keys */}
        <div className="flex">
          {notes
            .filter((n) => n.type === 'white')
            .map((key) => (
              <button
                key={key.note}
                className="w-12 h-48 bg-white border border-gray-300 rounded-b-md shadow-md flex items-end justify-center text-gray-700 font-semibold transition-transform duration-100 active:scale-95 active:bg-gray-200 text-xs"
                onClick={() => playNote(key.note)}
                onTouchStart={() => playNote(key.note)}
              >
                {key.note}
              </button>
            ))}
        </div>
        {/* Render black keys */}
        <div className="absolute" style={{ top: '0', left: '0' }}>
          {notes
            .filter((n) => n.type === 'black')
            .map((key) => {
              const index = notes.findIndex((n) => n.note === key.note);
              const precedingWhites = notes.slice(0, index).filter((n) => n.type === 'white').length;
              const leftPosition = precedingWhites * 3 - 1; // 3rem white width, 1rem half black width adjustment
              return (
                <button
                  key={key.note}
                  className="absolute w-8 h-32 bg-black border border-gray-800 rounded-b-md shadow-md flex items-end justify-center text-white font-semibold transition-transform duration-100 active:scale-95 active:bg-gray-600 text-xs"
                  style={{ left: `${leftPosition}rem` }}
                  onClick={() => playNote(key.note)}
                  onTouchStart={() => playNote(key.note)}
                >
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Piano;