/**
 * Smart Image Compressor Utility for Dokumentasi Kinerja
 * Optimizes photos to target ~150KB - 250KB while retaining crisp watermark clarity.
 */
const SmartCompressor = {
    /**
     * Compress canvas element into optimized DataURL
     * @param {HTMLCanvasElement} canvas 
     * @param {number} maxDim Maximum dimension (width/height), default 1000px
     * @param {number} quality JPEG quality between 0.65 and 0.85
     * @returns {string} Base64 DataURL
     */
    compressCanvas(canvas, maxDim = 1000, quality = 0.75) {
        let w = canvas.width;
        let h = canvas.height;

        if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.floor(w * ratio);
            h = Math.floor(h * ratio);
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            const ctx = tempCanvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(canvas, 0, 0, w, h);
            return tempCanvas.toDataURL('image/jpeg', quality);
        }

        return canvas.toDataURL('image/jpeg', quality);
    },

    /**
     * Process image file into compressed canvas & DataURL with aspect ratio preserved
     * @param {File} file 
     * @param {number} maxDim Maximum dimension (width/height), default 1000px
     * @param {number} quality JPEG quality between 0.65 and 0.85
     * @returns {Promise<{canvas: HTMLCanvasElement, dataUrl: string}>}
     */
    compressImageFile(file, maxDim = 1000, quality = 0.75) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = (e) => {
                const img = new Image();
                img.onerror = reject;
                img.onload = () => {
                    let w = img.width;
                    let h = img.height;

                    if (w > maxDim || h > maxDim) {
                        const ratio = Math.min(maxDim / w, maxDim / h);
                        w = Math.floor(w * ratio);
                        h = Math.floor(h * ratio);
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, w, h);

                    resolve({
                        canvas: canvas,
                        dataUrl: canvas.toDataURL('image/jpeg', quality)
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
};
