// public/LLMtalker.js

export async function getAssistantResponse(userMessage) {
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.assistantMessage;
  } catch (error) {
    console.error('Error getting assistant response:', error);
    throw error;
  }
}

export async function getConversationHistory() {
  try {
    const response = await fetch('/conversation', {
      method: 'GET',
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.conversationHistory;
  } catch (error) {
    console.error('Error getting conversation history:', error);
    throw error;
  }
}
