import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import FileUploader from '../ui/FileUploader';
import Button from '../ui/Button';
import CopyButton from '../ui/CopyButton';
import Spinner from '../ui/Spinner';
import { analyze_image } from '../../api/promptApi';

const ImageAnalyzer = () => {
    const {
        selectedImage,
        setSelectedImage,
        imagePrompt,
        setImagePrompt,
        isExtractingImage,
        setIsExtractingImage
    } = useAppContext();
    const toast = useToast();

    const handleExtract = async () => {
        if (!selectedImage) {
            toast.warning('Please upload an image first');
            return;
        }

        setIsExtractingImage(true);
        try {
            const result = await analyze_image(selectedImage);
            // New API returns JSON with visual_elements and prompts
            if (result && result.prompts) {
                const formattedOutput = `## Visual Elements
**Subject:** ${result.visual_elements?.subject || 'N/A'}
**Action:** ${result.visual_elements?.action || 'N/A'}
**Environment:** ${result.visual_elements?.environment || 'N/A'}

## Midjourney Prompt
\`\`\`
${result.prompts?.midjourney || 'N/A'}
\`\`\`

## Flux Prompt
\`\`\`
${result.prompts?.flux || 'N/A'}
\`\`\``;
                setImagePrompt(formattedOutput);
            } else if (result) {
                // Fallback: display raw result
                setImagePrompt(JSON.stringify(result, null, 2));
            } else {
                toast.error('Error extracting prompt: No response from AI');
            }
        } catch (error) {
            console.error('Image extraction error:', error);
            toast.error('An error occurred: ' + error.message);
        } finally {
            setIsExtractingImage(false);
        }
    };

    return (
        <div className="glass-card p-6 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
                <div className="
          w-12 h-12 rounded-xl
          bg-gradient-to-br from-[#ff00ff]/20 to-[#8b5cf6]/20
          flex items-center justify-center
        ">
                    <svg className="w-6 h-6 text-[#ff00ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Image to Prompt</h3>
                    <p className="text-sm text-[#8b8b9e]">Extract generation prompts from any image</p>
                </div>
            </div>

            <div className="space-y-4">
                <FileUploader
                    accept="image/*"
                    onFileSelect={setSelectedImage}
                />

                <Button
                    onClick={handleExtract}
                    loading={isExtractingImage}
                    disabled={!selectedImage}
                    className="w-full"
                    variant={selectedImage ? 'primary' : 'secondary'}
                >
                    {isExtractingImage ? 'Extracting Prompt...' : '✨ Extract Prompt'}
                </Button>
            </div>

            {/* Loading State */}
            {isExtractingImage && (
                <div className="mt-6 p-8 rounded-xl bg-[#1a1a2e] flex flex-col items-center justify-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-[#8b8b9e]">Analyzing visual elements...</p>
                </div>
            )}

            {/* Output */}
            {imagePrompt && !isExtractingImage && (
                <div className="mt-6 output-block">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a3e]">
                        <h4 className="font-semibold text-white">Extracted Prompt</h4>
                        <CopyButton text={imagePrompt} />
                    </div>
                    <div className="p-5">
                        <pre className="
              text-sm text-[#c8c8d8]
              whitespace-pre-wrap
              font-mono
              leading-relaxed
              max-h-[400px] overflow-y-auto
            ">
                            {imagePrompt}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageAnalyzer;
