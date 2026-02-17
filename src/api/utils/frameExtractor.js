// src/api/utils/frameExtractor.js - Video Frame Extraction

/**
 * Extract frames from video at specified intervals
 */
export function extractFramesInterval(videoFile, intervalSeconds = 3, onProgress = null) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const frames = [];

        video.src = URL.createObjectURL(videoFile);
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';

        video.onloadedmetadata = async () => {
            const scale = Math.min(1, 640 / video.videoWidth);
            canvas.width = video.videoWidth * scale;
            canvas.height = video.videoHeight * scale;

            const duration = video.duration;
            let currentTime = 0;
            const MAX_FRAMES = 25;

            let actualInterval = intervalSeconds;
            if (Math.floor(duration / intervalSeconds) > MAX_FRAMES) {
                actualInterval = Math.ceil(duration / MAX_FRAMES);
            }

            if (onProgress) onProgress(`Video: ${Math.round(duration)}s, every ${actualInterval}s...`);

            while (currentTime < duration && frames.length < MAX_FRAMES) {
                video.currentTime = currentTime;
                await new Promise(r => { video.onseeked = r; });
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                frames.push(canvas.toDataURL('image/jpeg', 0.6));
                if (onProgress) onProgress(`Frame ${frames.length} at ${Math.round(currentTime)}s`);
                currentTime += actualInterval;
            }

            URL.revokeObjectURL(video.src);
            resolve(frames);
        };

        video.onerror = () => {
            URL.revokeObjectURL(video.src);
            reject(new Error("Failed to load video"));
        };
    });
}
