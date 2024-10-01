// public/app.js

import { Recorder } from './recorder.js';
import { transcribeAudio } from './transcriber.js';
import { getAssistantResponse, getConversationHistory } from './LLMtalker.js';
import { playTextToSpeech } from './tts.js';

const recordBtn = document.getElementById('record-btn');
const conversationDiv = document.getElementById('conversation');
const loadingDiv = document.getElementById('loading');

const recorder = new Recorder();

recordBtn.addEventListener('click', async () => {
  if (recorder.isRecording) {
    // Stop recording
    try {
      const audioBlob = await recorder.stopRecording();
      recordBtn.textContent = 'Record Audio';
      loadingDiv.style.display = 'block';
      recordBtn.disabled = true; // Disable the button during processing

      // No longer clearing the conversationDiv here
      // conversationDiv.innerHTML = '';

      // Optionally, add a "Processing..." message to the conversation
      const processingMessage = document.createElement('p');
      processingMessage.textContent = 'Processing...';
      processingMessage.style.fontStyle = 'italic';
      processingMessage.id = 'processing-message';
      conversationDiv.appendChild(processingMessage);

      // Transcribe audio
      const transcription = await transcribeAudio(audioBlob);

      // Get assistant response
      const assistantMessage = await getAssistantResponse(transcription);

      // Get updated conversation history
      const conversationHistory = await getConversationHistory();

      // Remove the processing message
      const processingMsg = document.getElementById('processing-message');
      if (processingMsg) {
        conversationDiv.removeChild(processingMsg);
      }

      // Display conversation history
      displayConversation(conversationHistory);

      // Play TTS audio automatically
      await playTextToSpeech(assistantMessage);
    } catch (error) {
      console.error('Error during processing:', error);
      // Keep the conversation history intact and show the error
      const errorMessage = document.createElement('p');
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.color = 'red';
      conversationDiv.appendChild(errorMessage);
    } finally {
      loadingDiv.style.display = 'none';
      recordBtn.disabled = false; // Re-enable the button after processing
    }
  } else {
    // Start recording
    try {
      await recorder.startRecording();
      recordBtn.textContent = 'Stop Recording';
    } catch (error) {
      console.error('Recording Error:', error);
      const errorMessage = document.createElement('p');
      errorMessage.textContent = `Error: ${error.message}`;
      errorMessage.style.color = 'red';
      conversationDiv.appendChild(errorMessage);
    }
  }
});

// Function to display the conversation history
function displayConversation(conversationHistory) {
  conversationDiv.innerHTML = ''; // Clear previous content
  conversationHistory.forEach((message) => {
    const messageElement = document.createElement('p');
    if (message.role === 'user') {
      messageElement.textContent = `You: ${message.content}`;
      messageElement.style.fontWeight = 'bold';
    } else if (message.role === 'assistant') {
      messageElement.textContent = `Assistant: ${message.content}`;
    }
    conversationDiv.appendChild(messageElement);
  });
}

