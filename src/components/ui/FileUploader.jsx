import React, { useState, useRef } from 'react';

const FileUploader = ({
    label,
    accept = 'image/*',
    onFileSelect,
    className = '',
    preview = true
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const inputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (!file) return;

        setSelectedFile(file);
        onFileSelect(file);

        if (preview && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewUrl(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const clearFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-[#8b8b9e]">{label}</label>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`
          upload-zone
          min-h-[160px] p-6
          flex flex-col items-center justify-center gap-4
          cursor-pointer
          ${isDragging ? 'dragging' : ''}
          ${previewUrl ? 'p-4' : ''}
        `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileInput}
                    className="hidden"
                />

                {previewUrl ? (
                    <div className="relative w-full">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-[200px] mx-auto rounded-lg object-contain"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            className="
                absolute top-2 right-2
                w-8 h-8 rounded-full
                bg-[#ff4444] text-white
                flex items-center justify-center
                hover:bg-[#ff6666]
                transition-colors
              "
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="
              w-16 h-16 rounded-full
              bg-gradient-to-br from-[#00f5ff]/20 to-[#ff00ff]/20
              flex items-center justify-center
            ">
                            <svg className="w-8 h-8 text-[#00f5ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-white font-medium">
                                Drop your image here, or <span className="text-[#00f5ff]">browse</span>
                            </p>
                            <p className="text-[#5a5a6e] text-sm mt-1">
                                Supports: JPG, PNG, GIF, WebP
                            </p>
                        </div>
                    </>
                )}
            </div>

            {selectedFile && (
                <p className="text-sm text-[#8b8b9e]">
                    Selected: <span className="text-[#00f5ff]">{selectedFile.name}</span>
                </p>
            )}
        </div>
    );
};

export default FileUploader;
