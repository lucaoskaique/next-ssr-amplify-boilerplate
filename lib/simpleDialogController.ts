import { Session } from '@/types/client';
import EventEmitter from 'events';
import { getClient } from './client';

// Global state that persists across module instances
const globalState = globalThis as any;

if (!globalState.__simpleDialogControllerState) {
  globalState.__simpleDialogControllerState = {
    emitters: new Map<string, EventEmitter>(),
    subscriptionCounts: new Map<string, number>(),
    instanceId: Math.random().toString(36).substr(2, 9),
  };
  console.log(
    '[SimpleDialogController] Created global state with instanceId:',
    globalState.__simpleDialogControllerState.instanceId,
  );
}

class SimpleDialogController {
  private emitters: Map<string, EventEmitter>;
  private subscriptionCounts: Map<string, number>;
  private instanceId: string;

  constructor() {
    // Use global state instead of instance state
    this.emitters = globalState.__simpleDialogControllerState.emitters;
    this.subscriptionCounts =
      globalState.__simpleDialogControllerState.subscriptionCounts;
    this.instanceId = globalState.__simpleDialogControllerState.instanceId;

    console.log(
      '[SimpleDialogController] Initialized instance using global state:',
      this.instanceId,
    );
    console.log(
      '[SimpleDialogController] Current global dialog count:',
      this.emitters.size,
    );
  }

  private getEmitter(dialogId: string): EventEmitter {
    if (!this.emitters.has(dialogId)) {
      console.log(
        `[SimpleDialogController:${this.instanceId}] Creating new EventEmitter for dialog: ${dialogId}`,
      );
      console.log(
        `[SimpleDialogController:${this.instanceId}] Total dialogs tracked: ${this.emitters.size}`,
      );
      this.emitters.set(dialogId, new EventEmitter());
      this.subscriptionCounts.set(dialogId, 0);
    } else {
      console.log(
        `[SimpleDialogController:${this.instanceId}] Reusing existing EventEmitter for dialog: ${dialogId}`,
      );
    }
    const emitter = this.emitters.get(dialogId)!;
    const actualListeners = emitter.listenerCount('message');
    const trackedCount = this.subscriptionCounts.get(dialogId) || 0;
    console.log(
      `[SimpleDialogController:${this.instanceId}] EventEmitter for ${dialogId} - Actual listeners: ${actualListeners}, Tracked count: ${trackedCount}`,
    );
    return emitter;
  }

  subscribe(dialogId: string, callback: (data: any) => void): void {
    console.log(
      `[SimpleDialogController:${this.instanceId}] Subscribing to dialog: ${dialogId}`,
    );
    const emitter = this.getEmitter(dialogId);
    const currentCount = this.subscriptionCounts.get(dialogId) || 0;
    const actualListenersBefore = emitter.listenerCount('message');

    emitter.on('message', callback);
    this.subscriptionCounts.set(dialogId, currentCount + 1);

    const actualListenersAfter = emitter.listenerCount('message');
    console.log(
      `[SimpleDialogController:${this.instanceId}] Subscription added. Tracked count: ${currentCount} -> ${currentCount + 1}`,
    );
    console.log(
      `[SimpleDialogController:${this.instanceId}] Actual EventEmitter listeners: ${actualListenersBefore} -> ${actualListenersAfter}`,
    );
  }

  unsubscribe(dialogId: string, callback: (data: any) => void): void {
    console.log(
      `[SimpleDialogController] Unsubscribing from dialog: ${dialogId}`,
    );
    const emitter = this.emitters.get(dialogId);
    if (emitter) {
      const currentCount = this.subscriptionCounts.get(dialogId) || 0;
      emitter.off('message', callback);
      this.subscriptionCounts.set(dialogId, Math.max(0, currentCount - 1));

      console.log(
        `[SimpleDialogController] Subscription removed. Listeners for ${dialogId}: ${currentCount} -> ${Math.max(0, currentCount - 1)}`,
      );
    }
  }

  async appendMessage(
    session: Session,
    dialogId: string,
    message: string,
    personaId?: string,
  ): Promise<void> {
    const startTime = Date.now();
    console.log(
      `[SimpleDialogController:${this.instanceId}] Starting appendMessage for dialog: ${dialogId}`,
    );
    console.log(
      `[SimpleDialogController:${this.instanceId}] Message: "${message}"`,
    );
    console.log(
      `[SimpleDialogController:${this.instanceId}] PersonaId: ${personaId || 'undefined'}`,
    );

    try {
      const client = getClient();
      const flowId = 'd8ab237d-daba-8568-8000-000000000000';

      console.log(
        `[SimpleDialogController:${this.instanceId}] Using flowId: ${flowId}`,
      );

      // Check how many listeners we have BEFORE starting the stream
      const emitter = this.getEmitter(dialogId);
      const trackedCount = this.subscriptionCounts.get(dialogId) || 0;
      const actualCount = emitter.listenerCount('message');
      console.log(
        `[SimpleDialogController:${this.instanceId}] Current listeners for ${dialogId}: tracked=${trackedCount}, actual=${actualCount}`,
      );

      if (actualCount === 0) {
        console.warn(
          `[SimpleDialogController:${this.instanceId}] WARNING: No listeners for dialog ${dialogId} before starting stream!`,
        );
      }

      console.log(
        `[SimpleDialogController:${this.instanceId}] Calling client.appendPromptV2...`,
      );
      const streamStartTime = Date.now();

      // Get the stream from the client
      const stream = await client.appendPromptV2(
        session,
        dialogId,
        flowId,
        message,
        'question',
        {},
        personaId,
      );

      const streamCreationTime = Date.now() - streamStartTime;
      console.log(
        `[SimpleDialogController:${this.instanceId}] Stream created successfully in ${streamCreationTime}ms, starting to process items...`,
      );

      let itemCount = 0;
      let lastItemTime = Date.now();

      // Process each item in the stream
      for await (const item of stream) {
        itemCount++;
        const currentTime = Date.now();
        const timeSinceLastItem = currentTime - lastItemTime;
        const totalTime = currentTime - startTime;

        console.log(
          `[SimpleDialogController] Received stream item #${itemCount} after ${timeSinceLastItem}ms (total: ${totalTime}ms):`,
          {
            hasText: !!item.text,
            textLength: item.text?.length || 0,
            flags: item.flags,
            hasAudio: !!item.audio,
            itemType: typeof item,
          },
        );

        lastItemTime = currentTime;

        const data = {
          dialogId,
          text: item.text || '',
          flags: item.flags || [],
          audio: item.audio || null,
          timestamp: new Date().toISOString(),
        };

        // Check listeners again right before emitting
        const trackedListenerCount = this.subscriptionCounts.get(dialogId) || 0;
        const actualListenerCount = emitter.listenerCount('message');
        console.log(
          `[SimpleDialogController:${this.instanceId}] About to emit to ${actualListenerCount} listeners for dialog ${dialogId} (tracked: ${trackedListenerCount})`,
        );

        // Emit to all subscribers of this dialog
        const emitResult = emitter.emit('message', data);
        console.log(
          `[SimpleDialogController:${this.instanceId}] Message emission result: ${emitResult} (had listeners: ${emitResult})`,
        );

        // Break after reasonable number of items for testing
        if (itemCount > 20) {
          console.log(
            `[SimpleDialogController] Breaking after ${itemCount} items to prevent infinite loop`,
          );
          break;
        }
      }

      const totalDuration = Date.now() - startTime;
      console.log(
        `[SimpleDialogController] Stream processing completed. Items processed: ${itemCount}, Duration: ${totalDuration}ms`,
      );

      // Emit completion event
      const finalListenerCount = this.subscriptionCounts.get(dialogId) || 0;
      console.log(
        `[SimpleDialogController] Stream loop finished, preparing completion event...`,
      );
      const completionResult = emitter.emit('complete', {
        dialogId,
        itemCount,
        duration: totalDuration,
      });
      console.log(
        `[SimpleDialogController] Completion event emitted for dialog: ${dialogId} to ${finalListenerCount} listeners, result: ${completionResult}`,
      );
    } catch (error) {
      console.error(`[SimpleDialogController] Error in appendMessage:`, error);

      const emitter = this.emitters.get(dialogId);
      if (emitter) {
        const errorListenerCount = this.subscriptionCounts.get(dialogId) || 0;
        const errorEmitResult = emitter.emit('error', {
          dialogId,
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });

        console.log(
          `[SimpleDialogController] Error event emitted for dialog: ${dialogId} to ${errorListenerCount} listeners, result: ${errorEmitResult}`,
        );
      }
    }
  }

  getListenerCount(dialogId: string): number {
    return this.subscriptionCounts.get(dialogId) || 0;
  }

  getAllDialogStats(): { [dialogId: string]: number } {
    const stats: { [dialogId: string]: number } = {};
    Array.from(this.subscriptionCounts.entries()).forEach(
      ([dialogId, count]) => {
        stats[dialogId] = count;
      },
    );
    return stats;
  }

  cleanup(dialogId: string): void {
    console.log(
      `[SimpleDialogController] Cleaning up resources for dialog: ${dialogId}`,
    );
    const emitter = this.emitters.get(dialogId);
    if (emitter) {
      const listenerCount = this.subscriptionCounts.get(dialogId) || 0;
      console.log(
        `[SimpleDialogController] Removing ${listenerCount} listeners from dialog: ${dialogId}`,
      );
      emitter.removeAllListeners();
      this.emitters.delete(dialogId);
      this.subscriptionCounts.delete(dialogId);
    }
    console.log(
      `[SimpleDialogController] Cleanup completed for dialog: ${dialogId}`,
    );
  }
}

export default new SimpleDialogController();
