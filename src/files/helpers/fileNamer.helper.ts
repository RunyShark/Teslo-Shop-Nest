import { Request } from 'express';
import { v4 as uudi } from 'uuid';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  cb: Function,
) => {
  if (!file) return cb(new Error('fiel is empty'), false);
  const typeFile = file.mimetype.split('/')[1];
  const fileName = `${uudi()}.${typeFile}`;

  return cb(null, fileName);
};
