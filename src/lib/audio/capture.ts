export class MicCapture {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private onDataCallback: ((chunk: Blob) => void) | null = null;

  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Detect browser and select appropriate MIME type
      let mimeType: string;
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else {
        throw new Error('No supported audio MIME type found');
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
      });

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0 && this.onDataCallback) {
          this.onDataCallback(event.data);
        }
      };

      this.mediaRecorder.start(100); // 100ms timeslice
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone permission denied');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found');
        } else {
          throw new Error('Failed to access microphone: ' + error.message);
        }
      }
      throw new Error('Failed to access microphone');
    }
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
  }

  mute(): void {
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }

  unmute(): void {
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    }
  }

  onData(cb: (chunk: Blob) => void): void {
    this.onDataCallback = cb;
  }

  isActive(): boolean {
    return this.stream !== null && this.stream.active;
  }
}
