import type { CompositionPlanData, RenderProgress, WSMessage, AudioResult } from '@/types';

const API_BASE_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/render/ws';

/**
 * Render music using WebSocket for real-time progress updates.
 * 
 * @param compositionPlan - The composition plan to render
 * @param title - Optional title for the track
 * @param onProgress - Callback for progress updates
 * @returns Promise resolving to AudioResult
 */
export async function renderWithWebSocket(
  compositionPlan: CompositionPlanData,
  title: string | undefined,
  onProgress: (progress: RenderProgress) => void
): Promise<AudioResult> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    let hasResolved = false;

    ws.onopen = () => {
      console.log('WebSocket connected to /render/ws');
    };

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message);

        switch (message.type) {
          case 'progress':
            onProgress({
              stage: message.stage,
              percent: message.progress_percent,
              message: message.message,
            });

            // Send composition plan after receiving "connected" message
            if (message.stage === 'connected') {
              // Extract the core plan structure for the render request
              const core = compositionPlan.composition_plan;
              const renderPayload = {
                type: 'render',
                composition_plan: {
                  ...(title && { title }),
                  positive_global_styles: core.positive_global_styles || [],
                  negative_global_styles: core.negative_global_styles || [],
                  sections: core.sections,
                },
              };
              console.log('Sending render request via WebSocket:', renderPayload);
              ws.send(JSON.stringify(renderPayload));
            }
            break;

          case 'result':
            hasResolved = true;
            const data = message.data;
            resolve({
              audioUrl: `${API_BASE_URL}${data.stream_url}`,
              filename: data.filename,
              mimeType: data.content_type,
              downloadUrl: `${API_BASE_URL}${data.download_url}`,
              fileSizeBytes: data.file_size_bytes,
            });
            ws.close();
            break;

          case 'error':
            hasResolved = true;
            reject(new Error(`${message.error_code}: ${message.message}`));
            ws.close();
            break;
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
        reject(new Error('Invalid message from server'));
        ws.close();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (!hasResolved) {
        reject(new Error('WebSocket connection failed'));
      }
    };

    ws.onclose = (event) => {
      if (!hasResolved && !event.wasClean) {
        reject(new Error('WebSocket connection closed unexpectedly'));
      }
    };
  });
}
