import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imgName')
  findOneImg(
    @Res() res: Response,
    @Param('imgName')
    imgName: string,
  ) {
    const path = this.filesService.getStaticProducIgm(imgName);
    res.sendFile(path);
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
