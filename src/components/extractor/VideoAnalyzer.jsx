import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CopyButton from '../ui/CopyButton';
import Spinner from '../ui/Spinner';
import { analyze_video } from '../../api/promptApi';

const VideoAnalyzer = () => {
    const {
        videoUrl,
        setVideoUrl,
        videoAnalysis,
        setVideoAnalysis,
        isAnalyzingVideo,
        setIsAnalyzingVideo
    } = useAppContext();
    const toast = useToast();

    const handleAnalyze = async () => {
        if (!videoUrl.trim()) {
            toast.warning('Please enter a video URL');
            return;
        }

        // Basic URL validation
        if (!videoUrl.includes('youtube') && !videoUrl.includes('youtu.be') && !videoUrl.includes('tiktok')) {
            toast.warning('Please enter a valid YouTube or TikTok URL');
            return;
        }

        setIsAnalyzingVideo(true);
        try {
            const result = await analyze_video(videoUrl);
            // New API returns raw text directly
            if (result) {
                setVideoAnalysis(result);
            } else {
                toast.error('Error analyzing video: No response from AI');
            }
        } catch (error) {
            console.error('Video analysis error:', error);
            toast.error('An error occurred: ' + error.message);
        } finally {
            setIsAnalyzingVideo(false);
        }
    };

    return (
        <div className="glass-card p-6 fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="
          w-12 h-12 rounded-xl
          bg-gradient-to-br from-[#ff0000]/20 to-[#00f5ff]/20
          flex items-center justify-center
        ">
                    <svg className="w-6 h-6 text-[#00f5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Video to Prompt</h3>
                    <p className="text-sm text-[#8b8b9e]">Reverse-engineer any YouTube or TikTok video</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <Input
                            value={videoUrl}
                            onChange={setVideoUrl}
                            placeholder="https://youtube.com/watch?v=... or https://tiktok.com/..."
                        />
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        loading={isAnalyzingVideo}
                        disabled={!videoUrl.trim()}
                        className="whitespace-nowrap"
                    >
                        {isAnalyzingVideo ? 'Analyzing...' : '🔍 Analyze'}
                    </Button>
                </div>

                {/* Supported Platforms */}
                <div className="flex items-center gap-4 text-xs text-[#5a5a6e]">
                    <span>Supported:</span>
                    <span className="flex items-center gap-1">
                        <span className="text-red-500">▶</span> YouTube
                    </span>
                    <span className="flex items-center gap-1">
                        <span>🎵</span> TikTok
                    </span>
                </div>
            </div>

            {/* Loading State */}
            {isAnalyzingVideo && (
                <div className="mt-6 p-8 rounded-xl bg-[#1a1a2e] flex flex-col items-center justify-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-[#8b8b9e]">Analyzing video content...</p>
                </div>
            )}

            {/* Output */}
            {videoAnalysis && !isAnalyzingVideo && (
                <div className="mt-6 output-block">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a3e]">
                        <h4 className="font-semibold text-white">Analysis Result</h4>
                        <CopyButton text={videoAnalysis} />
                    </div>
                    <div className="p-5">
                        <pre className="
              text-sm text-[#c8c8d8]
              whitespace-pre-wrap
              font-mono
              leading-relaxed
              max-h-[400px] overflow-y-auto
            ">
                            {videoAnalysis}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoAnalyzer;
