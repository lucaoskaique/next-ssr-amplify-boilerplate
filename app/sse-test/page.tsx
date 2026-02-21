'use client';

import { useState } from 'react';
import { useSimpleSSE } from '@/hooks/useSimpleSSE';
import { createTestDialog } from '@/lib/testDialogActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Volume2, VolumeX } from 'lucide-react';

export default function SSETestPage() {
  console.log(
    '[Client] SSETestPage - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  const [dialogId, setDialogId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isCreatingDialog, setIsCreatingDialog] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<
    'checking' | 'authenticated' | 'unauthenticated'
  >('checking');

  const {
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
  } = useSimpleSSE({ dialogId });

  const createNewDialog = async () => {
    setIsCreatingDialog(true);
    try {
      addDebugLog('Creating dialog using server action...');

      const result = await createTestDialog();

      if (result.success && result.dialogId) {
        addDebugLog(`Dialog created successfully: ${result.dialogId}`);
        setDialogId(result.dialogId);
        setSessionStatus('authenticated');
      } else {
        setSessionStatus('unauthenticated');
        throw new Error(result.error || 'Failed to create dialog');
      }
    } catch (error) {
      addDebugLog(`Error creating dialog: ${error}`);

      let errorMessage = 'Failed to create dialog. ';
      if (error instanceof Error) {
        if (error.message.includes('session')) {
          errorMessage +=
            'Please make sure you are logged in to the dashboard.';
        } else if (
          error.message.includes('401') ||
          error.message.includes('Unauthorized')
        ) {
          errorMessage += 'Authentication failed. Please log in again.';
        } else if (
          error.message.includes('403') ||
          error.message.includes('Forbidden')
        ) {
          errorMessage += 'Access denied. Please check your permissions.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Unknown error occurred.';
      }

      alert(errorMessage);
    } finally {
      setIsCreatingDialog(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    await sendMessage(messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">SSE Test Page</h1>
        <p className="text-muted-foreground">
          Simplified SSE connection testing for debugging the chat functionality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chat Interface
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Dialog:{'  '}
                    {dialogId ? `${dialogId.substring(0, 8)}...` : 'None'}
                  </Badge>
                  <Badge className={getStatusColor(connectionStatus)}>
                    {connectionStatus}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className="p-2 h-8 w-8"
                    title={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
                  >
                    {isAudioMuted ? (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-foreground" />
                    )}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!dialogId ? (
                <Button
                  onClick={createNewDialog}
                  disabled={isCreatingDialog}
                  className="w-full"
                >
                  {isCreatingDialog
                    ? 'Creating Dialog...'
                    : 'Create New Dialog'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={connectSSE} variant="outline" size="sm">
                    Reconnect SSE
                  </Button>
                  <Button onClick={disconnectSSE} variant="outline" size="sm">
                    Disconnect SSE
                  </Button>
                  <Button
                    onClick={() => setDialogId(null)}
                    variant="outline"
                    size="sm"
                  >
                    New Dialog
                  </Button>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="h-64 border rounded p-4">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-center">
                    No messages yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`p-2 rounded max-w-xs ${
                          message.source === 'user'
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-gray-200 text-black mr-auto'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  disabled={!dialogId || isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!dialogId || !messageInput.trim() || isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={clearMessages} variant="outline" size="sm">
                  Clear Messages
                </Button>
                <Button onClick={stopAllAudio} variant="outline" size="sm">
                  Stop Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Connection Status</h4>
                  <Badge className={getStatusColor(connectionStatus)}>
                    {connectionStatus.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Statistics</h4>
                  <div className="text-sm space-y-1">
                    <p>Total Messages: {messages.length}</p>
                    <p>
                      User Messages:{'  '}
                      {messages.filter(m => m.source === 'user').length}
                    </p>
                    <p>
                      Agent Messages:{'  '}
                      {messages.filter(m => m.source === 'agent').length}
                    </p>
                    <p>Dialog ID: {dialogId || 'None'}</p>
                    <p>Session Status: {sessionStatus}</p>
                    <p>Audio Status: {audioStatus}</p>
                    <p>Audio Muted: {isAudioMuted ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Debug Log</h4>
                    <Button onClick={clearDebugLog} variant="outline" size="sm">
                      Clear Log
                    </Button>
                  </div>
                  <ScrollArea className="h-64 border rounded p-2">
                    <div className="space-y-1">
                      {debugLog.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No debug logs yet
                        </p>
                      ) : (
                        debugLog.map((log, index) => (
                          <p key={index} className="text-xs font-mono">
                            {log}
                          </p>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => sendMessage('Hello, this is a test message')}
                disabled={!dialogId || isLoading}
                className="w-full"
              >
                Send Test Message
              </Button>
              <Button
                onClick={() => sendMessage('Tell me a joke')}
                disabled={!dialogId || isLoading}
                className="w-full"
              >
                Request Joke (Audio Test)
              </Button>
              <Button
                onClick={() => sendMessage('What is 2+2?')}
                disabled={!dialogId || isLoading}
                className="w-full"
              >
                Ask Simple Question
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
