// Utilidade para compressão de imagens antes do upload
import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

/**
 * Comprime uma imagem para reduzir seu tamanho antes do upload
 * @param imageFile Arquivo de imagem a ser comprimido
 * @param options Opções de compressão
 * @returns Arquivo comprimido
 */
export async function compressImage(
  imageFile: File,
  options: CompressionOptions = {}
): Promise<File> {
  try {
    // Extrair tipo e extensão do arquivo original
    const originalType = imageFile.type || 'image/jpeg';
    const originalName = imageFile.name || 'imagem.jpg';
    const fileExtension = originalName.split('.').pop() || 'jpg';
    
    // Configurar as opções padrão
    const defaultOptions = {
      maxSizeMB: 1, // 1MB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: originalType, // Usa o mesmo tipo MIME do arquivo original
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const compressedFile = await imageCompression(imageFile, mergedOptions);
    
    console.log('Compressão de imagem:');
    console.log(`Nome original: ${originalName}`);
    console.log(`Tamanho original: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Tamanho após compressão: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Criar um novo File com o mesmo nome do arquivo original para preservar a extensão
    const renamedFile = new File(
      [compressedFile], 
      originalName, 
      { type: compressedFile.type }
    );
    
    return renamedFile;
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    // Se houver erro na compressão, retorna o arquivo original
    return imageFile;
  }
}
