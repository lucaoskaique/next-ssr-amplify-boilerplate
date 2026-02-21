'use server';

import { getSession } from '@/lib/action';
import simpleDialogController from '@/lib/simpleDialogController';
import { getClient } from './client';

export async function createTestDialog(): Promise<{
  success: boolean;
  dialogId?: string;
  error?: string;
}> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: 'No session found - please log in',
      };
    }

    const client = getClient();
    const metadata = await client.startDialog(session, undefined, 'test');

    return {
      success: true,
      dialogId: metadata.id,
    };
  } catch (error) {
    console.error('Error creating test dialog:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function triggerTestDialogStream(
  dialogId: string,
  message: string,
  personaId?: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: 'No session found - please log in',
      };
    }

    // We'll use the simple dialog controller instead of direct client calls
    // This ensures proper session handling on the server side

    // Trigger the stream processing which will emit events to SSE listeners
    await simpleDialogController.appendMessage(
      session,
      dialogId,
      message,
      personaId,
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error triggering test dialog stream:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
