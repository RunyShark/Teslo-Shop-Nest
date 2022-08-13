import {
  Controller,
  Get,
  Param,
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

  @Get('product/:imgName')
  findOneImg(@Param('imgName') imgName: string) {
    return this.filesService.getStaticProducIgm(imgName);
  }

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
    return this.filesService.createUploadedFile(file);
  }
}
