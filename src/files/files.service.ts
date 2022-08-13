import { BadGatewayException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticProducIgm(imgName: string) {
    return imgName;
  }

  createUploadedFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadGatewayException('Make sure that the file is an image');
    }

    const secureUrl = `${file.filename}`;

    return {
      secureUrl,
    };
  }
}
