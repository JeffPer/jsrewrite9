// public/tts.js

export async function playTextToSpeech(text) {
    try {
      const response = await fetch(`/tts?text=${encodeURIComponent(text)}`);
      if (!response.ok) {
        throw new Error('Failed to get TTS audio');
      }
  
      const audioData = await response.arrayBuffer();
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
  
      const audio = new Audio(url);
      audio.play();
  
      // Clean up the object URL after the audio has finished playing
      audio.onended = () => {
        URL.revokeObjectURL(url);
      };
  
    } catch (error) {
      console.error('Error playing TTS:', error);
      alert('Error playing TTS audio.');
    }
  }
  