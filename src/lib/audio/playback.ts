export class AudioPlaybackQueue {
  private audioContext: AudioContext | null = null;
  private queue: ArrayBuffer[] = [];
  private isPlaying: boolean = false;
  private analyser: AnalyserNode | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  init(): void {
    if (this.audioContext) {
      return;
    }

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.connect(this.audioContext.destination);
  }

  enqueue(chunk: ArrayBuffer): void {
    this.queue.push(chunk);

    if (!this.isPlaying) {
      this.play();
    }
  }

  async play(): Promise<void> {
    if (!this.audioContext || !this.analyser) {
      console.error('[AudioPlaybackQueue]', 'AudioContext not initialized');
      return;
    }

    if (this.isPlaying) {
      return;
    }

    this.isPlaying = true;

    while (this.queue.length > 0) {
      const chunk = this.queue.shift();
      if (!chunk) {
        continue;
      }

      try {
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        const chunkCopy = chunk.slice(0);
        const audioBuffer = await this.audioContext.decodeAudioData(chunkCopy);
        
        if (!this.isPlaying) {
          break;
        }

        await this.playBuffer(audioBuffer);
      } catch (error) {
        console.error('[AudioPlaybackQueue]', error);
      }
    }

    this.isPlaying = false;
  }

  private playBuffer(buffer: AudioBuffer): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.analyser) {
        resolve();
        return;
      }

      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = buffer;
      this.currentSource.connect(this.analyser);

      this.currentSource.onended = () => {
        this.currentSource = null;
        resolve();
      };

      this.currentSource.start();
    });
  }

  stop(): void {
    this.queue = [];
    this.isPlaying = false;

    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (error) {
        // Source may already be stopped
      }
      this.currentSource = null;
    }
  }

  getVolume(): number {
    if (!this.analyser) {
      return 0;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i] ?? 0;
    }

    const average = sum / bufferLength;
    return average / 255;
  }

  destroy(): void {
    this.stop();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
  }
}
