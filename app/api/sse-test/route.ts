import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/action';
import simpleDialogController from '@/lib/simpleDialogController';

// POST endpoint to submit message and trigger SSE response
export async function POST(request: NextRequest) {
  console.log(
    '[Server API] sse-test POST - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { dialogId, message, personaId } = body;

    if (!dialogId || !message) {
      return new NextResponse('Dialog ID and message are required', {
        status: 400,
      });
    }

    console.log(`[SSE Test Route] Processing message for dialog: ${dialogId}`);
    console.log(
      `[SSE Test Route] Current listener count: ${simpleDialogController.getListenerCount(dialogId)}`,
    );

    // Add message to simple dialog controller which will trigger SSE events
    await simpleDialogController.appendMessage(
      session,
      dialogId,
      message,
      personaId,
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[SSE Test Route] Error appending to dialog:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// GET endpoint for SSE streaming
export async function GET(request: NextRequest) {
  console.log(
    '[Server API] sse-test GET - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  const session = await getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const url = new URL(request.url);
  const dialogId = url.searchParams.get('dialogId');

  if (!dialogId) {
    return new NextResponse('Dialog ID is required', { status: 400 });
  }

  console.log(
    `[SSE Test Route] Setting up SSE connection for dialog: ${dialogId}`,
  );
  console.log(
    `[SSE Test Route] Current listener count before subscription: ${simpleDialogController.getListenerCount(dialogId)}`,
  );

  const body = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        console.log(
          `[SSE Test Route] Sending SSE event for dialog ${dialogId}:`,
          {
            hasText: !!data.text,
            textLength: data.text?.length || 0,
            hasAudio: !!data.audio,
            timestamp: data.timestamp,
          },
        );
        controller.enqueue(encoder.encode(message));
      };

      const sendHeartbeat = () => {
        const heartbeat = `data: ${JSON.stringify({
          type: 'heartbeat',
          timestamp: new Date().toISOString(),
          dialogId,
        })}\n\n`;
        controller.enqueue(encoder.encode(heartbeat));
      };

      // Send initial heartbeat
      sendHeartbeat();

      // Subscribe to dialog updates
      console.log(
        `[SSE Test Route] Subscribing to dialog updates for: ${dialogId}`,
      );
      simpleDialogController.subscribe(dialogId, sendEvent);

      console.log(
        `[SSE Test Route] Listener count after subscription: ${simpleDialogController.getListenerCount(dialogId)}`,
      );

      // Set up periodic heartbeat
      const heartbeatInterval = setInterval(sendHeartbeat, 10000); // Every 10 seconds

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log(
          `[SSE Test Route] SSE connection aborted for dialog: ${dialogId}`,
        );
        console.log(
          `[SSE Test Route] Listener count before unsubscribe: ${simpleDialogController.getListenerCount(dialogId)}`,
        );

        simpleDialogController.unsubscribe(dialogId, sendEvent);
        clearInterval(heartbeatInterval);

        console.log(
          `[SSE Test Route] Listener count after unsubscribe: ${simpleDialogController.getListenerCount(dialogId)}`,
        );
        controller.close();
      });
    },
  });

  const res = new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });

  return res;
}
