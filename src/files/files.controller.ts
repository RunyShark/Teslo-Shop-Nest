import {
  BadGatewayException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: 'src/static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  UploadedFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadGatewayException('Make sure that the file is an image');
    }
    return file;
  }
}
