export interface SpeechMessage {
  text: string;
  timestamp: number;
}

export interface SpeechBubble {
  message: SpeechMessage;
  lastMessages: Map<string, SpeechMessage>;
}
