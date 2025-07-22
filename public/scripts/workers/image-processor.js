self.onmessage = function(e) {
  const { data, operation } = e.data;
  const pixels = new Uint8Array(data);

  // Пример: Инвертирование цветов
  for(let i = 0; i < pixels.length; i += 4) {
    if(operation === 'invert') {
      pixels[i] = 255 - pixels[i];     // R
      pixels[i+1] = 255 - pixels[i+1]; // G
      pixels[i+2] = 255 - pixels[i+2]; // B
    }
  }
  
  self.postMessage(pixels.buffer, [pixels.buffer]);
};
