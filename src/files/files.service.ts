import { join } from 'path';
import { existsSync } from 'fs';

import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticProducIgm(imgName: string) {
    const path = join(__dirname, 'src-static-products', imgName);

    // if (!existsSync(path))
    //   throw new BadRequestException(`No product found with image ${imgName}`);

    return path;
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
