import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  cb: Function,
) => {
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  if (!file) return cb(new Error('fiel is empty'), false);
  const typeFile = file.mimetype.split('/')[1];

  if (!validExtensions.includes(typeFile)) {
    return cb(new Error('fiel is not permit'), false);
  }

  return cb(null, true);
};
