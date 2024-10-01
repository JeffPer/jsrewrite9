// public/transcriber.js

export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');

  try {
    const response = await fetch('/transcribe', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.transcription;
  } catch (error) {
    console.error('Transcription Error:', error);
    throw error;
  }
}
