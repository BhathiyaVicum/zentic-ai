const { pipeline } = require('@xenova/transformers');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

// Tell pdfjs where its background worker is
pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/build/pdf.worker.js');

// Keep the AI model here so we only load it once, reload the AI on every single request bcz outside function
let embeddingPipeline = null;

async function getEmbedding(text) {
  // If the AI isn't loaded yet, load it now
  if (!embeddingPipeline) {
    console.log('Loading embedding model...');
    embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding model ready');
  }
  
  // Chop text 2000 characters AI will crash
  const truncatedText = text.length > 2000 ? text.substring(0, 2000) : text;
  
  // Converts the text into an array of numbers.
  const result = await embeddingPipeline(truncatedText, { pooling: 'mean', normalize: true });
  
  // The AI gives back a special object. We convert it to a normal array of numbers.
  return Array.from(result.data);
}

async function extractTextFromPDF(buffer) {
  try {
    // Convert the file data into a format the PDF reader understands
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdfDocument.numPages;
    
    // Go through every single page of the PDF
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      
      // The PDF gives us text in tiny broken pieces so join those pieces together with spaces
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
     
    // Cleans line breaks and random extra spaces that up so it just normal text.
    const cleanedText = fullText.replace(/\s+/g, ' ').trim();
    console.log(`Extracted ${cleanedText.length} characters`);
    console.log(`Preview: ${cleanedText.substring(0, 200)}...`);
    
    return cleanedText;
  } catch (error) {
    console.error('PDF extraction error:', error.message);
    return ''; // If the PDF is broken, just return empty text so the server doesn't crash
  }
}

module.exports = { getEmbedding, extractTextFromPDF };