// public/recorder.js

export class Recorder {
    constructor() {
      this.mediaRecorder = null;
      this.audioChunks = [];
      this.isRecording = false;
    }
  
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        this.isRecording = true;
  
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
  
        this.mediaRecorder.start();
      } catch (err) {
        console.error('Microphone access denied:', err);
        throw new Error('Microphone access denied.');
      }
    }
  
    stopRecording() {
      return new Promise((resolve, reject) => {
        if (this.isRecording) {
          this.mediaRecorder.onstop = () => {
            this.isRecording = false;
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            resolve(audioBlob);
          };
          this.mediaRecorder.stop();
        } else {
          reject(new Error('No recording in progress.'));
        }
      });
    }
  }
  