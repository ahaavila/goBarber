import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  // Metodo de salvar o arquivo
  public async saveFile(file: string): Promise<string> {
    // Vou mover o arquivo da pasta tmp para a pasta uploads
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );

    return file;
  }

  // Metodo de deletar o arquivo
  public async deleteFile(file: string): Promise<void> {
    // Jogo o caminho do meu arquivo para uma constante
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);

    try {
      // Verifico se o arquivo existe
      await fs.promises.stat(filePath);
    } catch {
      // Se o arquivo não existir eu retorno nada
      return;
    }

    // Se existir eu deleto o arquivo
    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
