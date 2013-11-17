window.Note = (function() {

    var noteNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    var variantNames = [null,"Db",null,"Eb",null,null,"Gb",null,"Ab",null,"Bb",null];

    var Note = function (note) {

        this.baseNote = 440;
        this.octaveMiddleC = 4;
        this.lastOctave = 4;
        this.lastPitch = -1;
        this.name = "A4";
        this.frequency = 440;
        this.midi = 69;

        if (note) {
            if (note.frequency) {
                this.setFrequency(note.frequency);
                return;
            }
            if (note.midi) {
                this.setMIDI(note.midi);
                return;
            }
            if (note.name) {
                this.setName(note.name);
                return;
            }
        }
    }

    Note.prototype.setFrequency = function (freq) {
        this.frequency = freq;
        this.midi = this._calculateFreq2Midi(freq);
        this.name = this._calculateMidi2Name(this.midi);
    }

    Note.prototype.setMIDI = function (noteNum) {
        this.midi = noteNum;
        this.name = this._calculateMidi2Name(noteNum);
        this.frequency = this._calculateMidi2Freq(noteNum);
    }

    Note.prototype.setName = function (name) {
        this.midi = this._calculateName2Midi(name);
        this.name = this._calculateMidi2Name(this.midi);
        this.frequency = this._calculateMidi2Freq(this.midi);
    }

    Note.prototype.freqToMidi = function (freq, baseNote) {
        var bs = baseNote || 440.0;
        return Math.round((12 * (Math.log(freq / (bs / 2)) / Math.log(2))) + 57);
    }

    Note.prototype._calculateFreq2Midi = function (freq) {
        return this.freqToMidi (freq, this.baseNote);
    }

    Note.prototype.midi2Freq = function (noteNum, baseNote) {
        var bs = baseNote || 440;
        return bs * Math.pow(2, (noteNum - 69) / 12);
    }

    Note.prototype._calculateMidi2Freq = function (noteNum) {
        return this.midi2Freq(noteNum, this.baseNote);
    }

    Note.prototype.midi2Name = function (noteNum, lastPitch, lastOctave, octaveMiddleC) {

        var lp = lastPitch || -1;
        var lo = lastOctave || 4;
        var omc = octaveMiddleC || 4;

        var	octaveAdjust = 0;
        while (noteNum < 0) {
            noteNum += 12;
            octaveAdjust -= 1;
        }
        var	pitch = noteNum % 12;
        var octave = (Math.floor(noteNum / 12) - (5 - omc)) + octaveAdjust;
        var noteName = noteNames[pitch] + octave.toString();
        if (variantNames[pitch] != null) {
            noteName += "/" + variantNames[pitch] + octave.toString();
        }

        return {name: noteName, pitch: pitch, octave: octave };
    }

    Note.prototype._calculateMidi2Name = function (noteNum) {

        var res = this.midi2Name(noteNum, this.lastPitch, this.lastOctave, this.octaveMiddleC);

        this.lastPitch = res.pitch;
        this.lastOctave = res.octave;

        return res.name;

    }

    Note.prototype.name2Midi = function (noteName, lastOctave, lastPitch, octaveMiddleC) {

        var lo = lastOctave || 4;
        var lp = lastPitch || -1;
        var omc = octaveMiddleC || 4;

        var	octave = lo;

        var	octaveIndex = noteName.search(/[-+]*\d+/);
        if (octaveIndex != -1) {
            var	octaveStr = noteName.substring(octaveIndex);
            octave = parseInt(octaveStr);
            if (isNaN(octave) || (octave < -4) || (octave > 11)) {
                octave = lo;
            }
        }

        var	noteStr = noteName.charAt(0).toUpperCase();
        var	noteVariant = noteName.charAt(1);
        if ((noteVariant == "b") || (noteVariant == "#")) {
            noteStr += noteVariant;
        }

        var pitchMatch = null;
        var	pitchNum = -1;
        for (var i=11; i>=0; i--) {
            if ((variantNames[i] != null) && (noteStr.indexOf(variantNames[i]) == 0)) {
                pitchNum = i;
                pitchMatch = variantNames[i];
                break;
            }
        }
        if (pitchNum < 0) {
            for (var i=11; i>=0; i--) {
                if (noteStr.indexOf(noteNames[i]) == 0) {
                    pitchNum = i;
                    pitchMatch = noteNames[i];
                    break;
                }
            }
        }
        var midi;
        if (pitchNum < 0) {
            pitchNum = lp;
        }
        if (pitchNum < 0) {
            // Still an invalid note? Use default
            midi = 69;

        }
        else {
            midi = Math.round(pitchNum + ((octave + (5 - omc)) * 12));
        }

        return midi;
    };

    Note.prototype._calculateName2Midi = function (noteName) {
        return this.name2Midi (noteName, this.lastOctave, this.lastPitch, this.octaveMiddleC);
    };

    return Note;

})();