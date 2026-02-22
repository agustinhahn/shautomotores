import { useState, useCallback } from 'react';
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';

const ImageUpload = ({ onImagesChange, initialImages = [] }) => {
    const [images, setImages] = useState(initialImages); // { file, preview, isMain, url (if existing) }
    const [isDragging, setIsDragging] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const processFiles = async (files) => {
        setProcessing(true);
        setError('');
        const newImages = [...images];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten archivos de imagen.');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                 setError(`La imagen ${file.name} es demasiado pesada (>10MB).`);
                 continue;
            }

            try {
                const { file: optimizedFile, preview } = await optimizeImage(file);
                newImages.push({
                    file: optimizedFile,
                    preview,
                    isMain: newImages.length === 0 // First image is main by default
                });
            } catch (err) {
                console.error(err);
                setError('Error al procesar una de las imágenes.');
            }
        }

        setImages(newImages);
        onImagesChange(newImages);
        setProcessing(false);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    }, [images]);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        // If we removed the main image, make the first one main
        if (images[index].isMain && newImages.length > 0) {
            newImages[0].isMain = true;
        }
        setImages(newImages);
        onImagesChange(newImages);
    };

    const setMain = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isMain: i === index
        }));
        setImages(newImages);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                    ${isDragging ? 'border-accent bg-accent/10' : 'border-gray-600 hover:border-gray-500 bg-gray-800'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <input 
                    type="file" 
                    id="fileInput" 
                    multiple 
                    className="hidden" 
                    onChange={handleChange} 
                    accept="image/*"
                />
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="p-4 bg-gray-700 rounded-full">
                        <Upload size={32} className="text-secondary" />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-white">Haz click o arrastra imágenes aquí</p>
                        <p className="text-sm">Soporta JPG, PNG, WEBP (Max 10MB)</p>
                        <p className="text-xs text-gray-500 mt-1">Se optimizarán automáticamente a WebP</p>
                    </div>
                </div>
            </div>

            {processing && <p className="text-accent text-center animate-pulse">Optimizando imágenes...</p>}
            {error && <p className="text-red-400 text-center">{error}</p>}

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
                            <img 
                                src={img.preview || img.url} 
                                alt={`preview ${index}`} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                <div className="flex justify-end">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                        className="p-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                                        title="Eliminar"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setMain(index); }}
                                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1
                                            ${img.isMain ? 'bg-accent text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}
                                        `}
                                    >
                                        <Star size={12} fill={img.isMain ? "black" : "none"} />
                                        {img.isMain ? 'Principal' : 'Hacer Principal'}
                                    </button>
                                </div>
                            </div>
                            {img.isMain && (
                                <div className="absolute top-2 left-2 bg-accent text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                    PORTADA
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
