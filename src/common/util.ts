import { fileTypeFromBuffer } from 'file-type';

export const getImageMetadata = async (
  image: string
): Promise<{ Data: Buffer; Mime: string; Extension: string }> => {
  const buffer = Buffer.from(
    image.substr(0, 7) === 'base64,' ? image.substr(7, image.length) : image,
    'base64'
  );
  const fileInfo = await fileTypeFromBuffer(buffer);

  return { Data: buffer, Mime: fileInfo.mime, Extension: fileInfo.ext };
};

export * from 'util';
