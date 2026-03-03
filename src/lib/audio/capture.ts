// TODO: Implement browser audio capture using MediaRecorder or AudioWorklet

export async function initializeAudioCapture(): Promise<MediaStream> {
  throw new Error('Not implemented');
}

export function stopAudioCapture(stream: MediaStream): void {
  stream.getTracks().forEach(track => track.stop());
}
