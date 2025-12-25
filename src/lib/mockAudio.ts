/**
 * Generates a small playable WAV tone as a Blob.
 * This is a simple sine wave tone for demo purposes.
 */
export function generateMockWavBlob(): Blob {
  const sampleRate = 44100;
  const duration = 5; // 5 seconds
  const frequency = 440; // A4 note
  const volume = 0.3;

  const numSamples = sampleRate * duration;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, fileSize, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Generate audio data (sine wave with envelope)
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    
    // Create an interesting sound with multiple harmonics and envelope
    const envelope = Math.min(1, t * 4) * Math.max(0, 1 - (t - duration + 0.5) * 2);
    
    // Main tone with harmonics
    const sample = 
      Math.sin(2 * Math.PI * frequency * t) * 0.5 +
      Math.sin(2 * Math.PI * frequency * 2 * t) * 0.25 +
      Math.sin(2 * Math.PI * frequency * 3 * t) * 0.15 +
      Math.sin(2 * Math.PI * frequency * 0.5 * t) * 0.1;
    
    // Add slight vibrato
    const vibrato = Math.sin(2 * Math.PI * 5 * t) * 0.02;
    const finalSample = sample * (1 + vibrato) * envelope * volume;
    
    // Convert to 16-bit integer
    const int16 = Math.max(-32768, Math.min(32767, Math.round(finalSample * 32767)));
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Creates an object URL for the mock audio blob.
 */
export function createMockAudioUrl(): string {
  const blob = generateMockWavBlob();
  return URL.createObjectURL(blob);
}
