import * as fileType from 'file-type';

export const getImageMetadata = async (
  image: string
): Promise<{ data: Buffer; mime: string; extension: string }> => {
  const buffer = Buffer.from(
    image.substr(0, 7) === 'base64,' ? image.substr(7, image.length) : image,
    'base64'
  );
  const fileInfo = await fileType.fromBuffer(buffer);

  return { data: buffer, mime: fileInfo.mime, extension: fileInfo.ext };
};

export * from 'util';
