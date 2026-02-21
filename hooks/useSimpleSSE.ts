import { useState, useEffect, useCallback, useRef } from 'react';
import { getSession } from '@/lib/action';

interface UseSimpleSSEProps {
  dialogId: string | null;
}

interface SimpleSSEMessage {
  id: string;
  text: string;
  timestamp: string;
  source: 'user' | 'agent';
}

// Simple audio chunk interface
interface SimpleAudioChunk {
  id: number;
  audio: HTMLAudioElement;
  audioUrl: string;
  isPlaying: boolean;
  isFinished: boolean;
}

export const useSimpleSSE = ({ dialogId }: UseSimpleSSEProps) => {
  console.log('[Client Hook] useSimpleSSE - API_SERVER_URL:', process.env.API_SERVER_URL);
  const [messages, setMessages] = useState<SimpleSSEMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [audioStatus, setAudioStatus] = useState<
    'idle' | 'loading' | 'playing' | 'finished'
  >('idle');

  const eventSourceRef = useRef<EventSource | null>(null);
  const messagesRef = useRef<SimpleSSEMessage[]>([]);
  const audioChunksRef = useRef<SimpleAudioChunk[]>([]);
  const currentChunkIndexRef = useRef(0);
  const chunkIdCounterRef = useRef(0);
  const isPlayingAudioRef = useRef(false);
  const responseCompleteRef = useRef(false);

  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    setDebugLog(prev => [...prev.slice(-19), logEntry]); // Keep last 20 entries
  }, []);

  // Audio processing functions
  const pcmToWav = useCallback((pcmData: Uint8Array): ArrayBuffer => {
    const sampleRate = 44100;
    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
    const fileSize = 36 + dataSize;

    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // WAV header
    view.setUint32(0, 0x46464952, true); // "RIFF"
    view.setUint32(4, fileSize, true);
    view.setUint32(8, 0x45564157, true); // "WAVE"

    // "fmt " sub-chunk
    view.setUint32(12, 0x20746d66, true); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);

    // "data" sub-chunk
    view.setUint32(36, 0x61746164, true); // "data"
    view.setUint32(40, dataSize, true);

    // Copy PCM data
    const wavData = new Uint8Array(buffer);
    wavData.set(pcmData, 44);

    return buffer;
  }, []);

  // Use a ref to avoid circular dependencies
  const playNextChunkRef = useRef<() => Promise<void>>();

  const playNextChunk = useCallback(async () => {
    if (currentChunkIndexRef.current >= audioChunksRef.current.length) {
      return;
    }

    const chunk = audioChunksRef.current[currentChunkIndexRef.current];
    if (chunk && !chunk.isPlaying && !chunk.isFinished) {
      try {
        chunk.isPlaying = true;
        isPlayingAudioRef.current = true;
        setAudioStatus('playing');
        await chunk.audio.play();
        addDebugLog(
          `Playing audio chunk ${chunk.id} (${currentChunkIndexRef.current + 1}/${audioChunksRef.current.length})`,
        );
      } catch (error) {
        addDebugLog(`Failed to play audio chunk ${chunk.id}: ${error}`);
        chunk.isFinished = true;
        // Handle error by moving to next chunk
        currentChunkIndexRef.current++;
        if (playNextChunkRef.current) {
          playNextChunkRef.current();
        }
      }
    }
  }, [addDebugLog]);

  // Set the ref after the function is defined
  playNextChunkRef.current = playNextChunk;

  const onChunkFinished = useCallback(
    (finishedChunk: SimpleAudioChunk) => {
      addDebugLog(`Audio chunk ${finishedChunk.id} finished playing`);

      // Clean up URL
      URL.revokeObjectURL(finishedChunk.audioUrl);

      // Move to next chunk
      currentChunkIndexRef.current++;

      // Try to play next chunk
      if (playNextChunkRef.current) {
        playNextChunkRef.current();
      }

      // Check if we're done
      if (currentChunkIndexRef.current >= audioChunksRef.current.length) {
        if (responseCompleteRef.current) {
          addDebugLog('All audio chunks played and response complete');
          setAudioStatus('finished');
          isPlayingAudioRef.current = false;
        } else {
          addDebugLog('Audio queue empty, waiting for more chunks');
          isPlayingAudioRef.current = false;
        }
      }
    },
    [addDebugLog],
  );

  const processAudioChunk = useCallback(
    (audioData: any) => {
      if (isAudioMuted || !audioData.data) {
        return;
      }

      try {
        // Decode base64 PCM data
        const pcmData = new Uint8Array(
          atob(audioData.data)
            .split('')
            .map(c => c.charCodeAt(0)),
        );

        // Convert to WAV
        const wavData = pcmToWav(pcmData);
        const wavBlob = new Blob([wavData], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(wavBlob);

        const audio = new Audio(audioUrl);
        const chunkId = ++chunkIdCounterRef.current;

        const chunk: SimpleAudioChunk = {
          id: chunkId,
          audio,
          audioUrl,
          isPlaying: false,
          isFinished: false,
        };

        // Set up event listeners
        audio.addEventListener('ended', () => {
          if (!chunk.isFinished) {
            chunk.isFinished = true;
            chunk.isPlaying = false;
            onChunkFinished(chunk);
          }
        });

        audio.addEventListener('error', e => {
          if (!chunk.isFinished) {
            addDebugLog(`Audio chunk ${chunkId} error: ${e}`);
            chunk.isFinished = true;
            chunk.isPlaying = false;
            onChunkFinished(chunk);
          }
        });

        // Add to queue
        audioChunksRef.current.push(chunk);
        addDebugLog(
          `Added audio chunk ${chunkId} to queue (${audioChunksRef.current.length} total)`,
        );

        // Start playing if not already playing
        if (!isPlayingAudioRef.current) {
          playNextChunk();
        }
      } catch (error) {
        addDebugLog(`Error processing audio chunk: ${error}`);
      }
    },
    [isAudioMuted, pcmToWav, onChunkFinished, addDebugLog, playNextChunk],
  );

  const initializeAudio = useCallback(() => {
    audioChunksRef.current = [];
    currentChunkIndexRef.current = 0;
    chunkIdCounterRef.current = 0;
    isPlayingAudioRef.current = false;
    responseCompleteRef.current = false;
    setAudioStatus('loading');
    addDebugLog('Audio session initialized');
  }, [addDebugLog]);

  const stopAllAudio = useCallback(() => {
    // Stop all playing audio
    audioChunksRef.current.forEach(chunk => {
      if (!chunk.isFinished) {
        chunk.audio.pause();
        chunk.audio.currentTime = 0;
        URL.revokeObjectURL(chunk.audioUrl);
        chunk.isFinished = true;
      }
    });

    // Reset state
    audioChunksRef.current = [];
    currentChunkIndexRef.current = 0;
    isPlayingAudioRef.current = false;
    responseCompleteRef.current = false;
    setAudioStatus('idle');
    addDebugLog('All audio stopped');
  }, [addDebugLog]);

  const addMessage = useCallback(
    (message: SimpleSSEMessage) => {
      messagesRef.current = [...messagesRef.current, message];
      setMessages([...messagesRef.current]);
      addDebugLog(
        `Added message: ${message.source} - "${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}"`,
      );
    },
    [addDebugLog],
  );

  const connectSSE = useCallback(() => {
    if (!dialogId) {
      addDebugLog('No dialogId provided, cannot connect SSE');
      return;
    }

    if (eventSourceRef.current) {
      addDebugLog('Closing existing SSE connection');
      eventSourceRef.current.close();
    }

    const sseUrl = `/api/sse-test?dialogId=${dialogId}`;
    addDebugLog(`Connecting to SSE: ${sseUrl}`);
    setConnectionStatus('connecting');

    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      addDebugLog('SSE connection opened successfully');
      setConnectionStatus('connected');
    };

    eventSource.onmessage = event => {
      addDebugLog(
        `SSE message received: ${event.data.substring(0, 100)}${event.data.length > 100 ? '...' : ''}`,
      );

      try {
        const data = JSON.parse(event.data);

        if (data.text) {
          const message: SimpleSSEMessage = {
            id: `${Date.now()}-${Math.random()}`,
            text: data.text,
            timestamp: new Date().toISOString(),
            source: 'agent',
          };
          addMessage(message);
        }

        if (data.audio) {
          addDebugLog(`Audio data received: done=${data.audio.done}`);

          // Process audio chunk
          if (data.audio.data) {
            processAudioChunk(data.audio);
          }

          // Mark response complete when audio is done
          if (data.audio.done) {
            responseCompleteRef.current = true;
            addDebugLog('Audio response marked as complete');
          }
        }

        if (data.flags) {
          addDebugLog(`Flags received: ${JSON.stringify(data.flags)}`);
        }
      } catch (error) {
        addDebugLog(`Error parsing SSE message: ${error}`);
      }
    };

    eventSource.onerror = error => {
      addDebugLog(`SSE error occurred: ${JSON.stringify(error)}`);
      setConnectionStatus('error');

      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (eventSourceRef.current === eventSource) {
          addDebugLog('Attempting to reconnect SSE...');
          connectSSE();
        }
      }, 3000);
    };
  }, [dialogId, addDebugLog, addMessage]);

  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      addDebugLog('Manually disconnecting SSE');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnectionStatus('disconnected');
    }
  }, [addDebugLog]);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!dialogId) {
        addDebugLog('Cannot send message: no dialogId');
        return;
      }

      setIsLoading(true);

      // Add user message immediately
      const userMessage: SimpleSSEMessage = {
        id: `user-${Date.now()}`,
        text: messageText,
        timestamp: new Date().toISOString(),
        source: 'user',
      };
      addMessage(userMessage);

      try {
        addDebugLog(`Sending message: "${messageText}"`);

        // Initialize audio for new message
        initializeAudio();

        // Import and use the server action
        const { triggerTestDialogStream } = await import(
          '@/lib/testDialogActions'
        );
        const result = await triggerTestDialogStream(dialogId, messageText);

        if (result.success) {
          addDebugLog('Message sent successfully via server action');
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      } catch (error) {
        addDebugLog(`Error sending message: ${error}`);
      } finally {
        setIsLoading(false);
      }
    },
    [dialogId, addMessage, addDebugLog],
  );

  const clearMessages = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
    addDebugLog('Messages cleared');
  }, [addDebugLog]);

  const clearDebugLog = useCallback(() => {
    setDebugLog([]);
  }, []);

  // Auto-connect when dialogId is available
  useEffect(() => {
    if (dialogId) {
      connectSSE();
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [dialogId, connectSSE]);

  return {
    messages,
    isLoading,
    connectionStatus,
    debugLog,
    sendMessage,
    connectSSE,
    disconnectSSE,
    clearMessages,
    clearDebugLog,
    addDebugLog,
    // Audio controls
    isAudioMuted,
    setIsAudioMuted,
    audioStatus,
    stopAllAudio,
  };
};
