self.onmessage = function(e) {
    const { data, operation } = e.data;
    const pixels = new Uint8ClampedArray(data);
    
    switch(operation) {
        case 'invert':
            for(let i = 0; i < pixels.length; i += 4) {
                pixels[i] = 255 - pixels[i];
                pixels[i+1] = 255 - pixels[i+1];
                pixels[i+2] = 255 - pixels[i+2];
            }
            break;
            
        case 'grayscale':
            for(let i = 0; i < pixels.length; i += 4) {
                const avg = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
                pixels[i] = pixels[i+1] = pixels[i+2] = avg;
            }
            break;
    }
    
    self.postMessage(pixels.buffer, [pixels.buffer]);
};
