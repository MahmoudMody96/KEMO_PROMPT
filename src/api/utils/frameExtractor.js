// src/api/utils/frameExtractor.js - Video Frame Extraction

// Must not exceed MAX_IMAGES in server/src/routes/ai.js.
//
// This used to be 25 while the server rejected anything over 6, so every video
// analysis got a 400 back — the feature could never succeed. Frames are spread
// evenly across the whole clip rather than taken from the first N seconds, so a
// smaller budget still describes the entire video.
const MAX_FRAMES = 6;

// A video that loads its metadata but then stalls on seek used to leave the
// promise pending forever: the spinner span, and the only way out was a reload.
const SEEK_TIMEOUT_MS = 5000;

/** Resolve when the video finishes seeking, or reject if it stalls. */
function seekTo(video, time) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            cleanup();
            reject(new Error(`Timed out seeking to ${Math.round(time)}s`));
        }, SEEK_TIMEOUT_MS);

        const cleanup = () => {
            clearTimeout(timer);
            video.onseeked = null;
            video.onerror = null;
        };

        video.onseeked = () => { cleanup(); resolve(); };
        video.onerror = () => { cleanup(); reject(new Error('Video decoding failed while seeking')); };
        video.currentTime = time;
    });
}

/**
 * Extract up to MAX_FRAMES evenly spaced frames from a video file.
 *
 * @param {File}   videoFile
 * @param {number} intervalSeconds  preferred spacing; widened automatically when
 *                                  the clip is long enough to exceed MAX_FRAMES
 * @param {(msg: string) => void} [onProgress]
 * @returns {Promise<string[]>} JPEG data URLs
 */
export function extractFramesInterval(videoFile, intervalSeconds = 3, onProgress = null) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const frames = [];

        const objectUrl = URL.createObjectURL(videoFile);
        video.src = objectUrl;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';

        const fail = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
        };

        video.onloadedmetadata = async () => {
            try {
                const scale = Math.min(1, 640 / video.videoWidth);
                canvas.width = video.videoWidth * scale;
                canvas.height = video.videoHeight * scale;

                const duration = video.duration;
                if (!Number.isFinite(duration) || duration <= 0) {
                    throw new Error('Could not read the video duration');
                }

                // Widen the interval so the frames we can afford still span the
                // whole clip instead of clustering at the start.
                let actualInterval = intervalSeconds;
                if (duration / intervalSeconds > MAX_FRAMES) {
                    actualInterval = duration / MAX_FRAMES;
                }

                if (onProgress) {
                    onProgress(`Video: ${Math.round(duration)}s, sampling every ${Math.round(actualInterval)}s...`);
                }

                let currentTime = 0;
                while (currentTime < duration && frames.length < MAX_FRAMES) {
                    await seekTo(video, currentTime);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    frames.push(canvas.toDataURL('image/jpeg', 0.6));
                    if (onProgress) onProgress(`Frame ${frames.length}/${MAX_FRAMES} at ${Math.round(currentTime)}s`);
                    currentTime += actualInterval;
                }

                URL.revokeObjectURL(objectUrl);
                resolve(frames);
            } catch (err) {
                fail(err);
            }
        };

        video.onerror = () => fail(new Error('Failed to load video'));
    });
}
