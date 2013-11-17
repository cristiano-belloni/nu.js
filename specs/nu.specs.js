var assert = chai.assert;
var should = chai.should();

describe('Note', function(){

    describe('#Note instance methods', function(){

        var note;

        beforeEach(function(){
            console.log('create a new Note object');
            note = new Note ();
        });

        it('should create a default Note object with default values', function(){
            note.name.should.equal("A4");
            note.frequency.should.equal(440);
            note.midi.should.equal(69);
        });
        it('should change frequency correctly', function(){
            note.setFrequency(293.6647679174);
            note.name.should.equal("D4");
            note.midi.should.equal(62);
            note.setFrequency(554.3652619537);
            note.name.should.equal("C#5/Db5");
            note.midi.should.equal(73);
        });
        it('should change midi note correctly', function(){
            note.setMIDI(90);
            note.name.should.equal("F#6/Gb6");
            note.frequency.should.be.closeTo(1479.98, 0.01);
        });
        it('should change note name correctly', function(){
            note.setName("Eb9");
            note.name.should.equal("D#9/Eb9");
            note.midi.should.equal(123);
            note.frequency.should.be.closeTo(9956.06, 0.01);
            note.setName("C#0");
            note.name.should.equal("C#0/Db0");
            note.midi.should.equal(13);
            note.frequency.should.be.closeTo(17.32, 0.01);
        });
        it('should use default octave on incomplete name', function(){
            note.setName("A#");
            note.name.should.equal("A#4/Bb4");
        });
        it('should use last octave on incomplete name', function(){
            note.setFrequency(932.33);
            note.name.should.equal("A#5/Bb5");
            note.setName("Gb");
            note.midi.should.equal(78);
        });
        it('should respond to an invalid note', function(){
            note.setName("invalid string");
            note.name.should.equal("A4");
            note.midi.should.equal(69);
        });
        it('should respond to an invalid variant', function(){
            note.setName("E#6");
            note.name.should.equal("E6");
        });
    });

    describe('#Passing elements to a constructor', function(){
        it ('should create a new note using only the frequency parameter', function() {
            var note = new Note ({frequency: 261.63, midi: 88, name: "A#6"});
            note.midi.should.equal(60);
            note.name.should.equal("C4");
        });
        it ('should create a new note using only the midi parameter', function() {
            var note = new Note ({midi: 88, name: "A#6"});
            note.frequency.should.be.closeTo(1318.51,0.01);
            note.name.should.equal("E6");
        });
        it ('should create a new note using only the name parameter', function() {
            var note = new Note ({name: "A#6"});
            note.frequency.should.be.closeTo(1864.66,0.01);
            note.name.should.equal("A#6/Bb6");
            note.midi.should.equal(94);
        });
    });

});