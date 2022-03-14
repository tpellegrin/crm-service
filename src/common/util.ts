import * as fileType from 'file-type';

export const getImageMetadata = async (
  image: string
): Promise<{ data: Buffer; mime: string; extension: string }> => {
  const buffer = Buffer.from(image.split(',')[1], 'base64');
  const fileInfo = await fileType.fromBuffer(buffer);
  console.log(fileInfo);

  return { data: buffer, mime: fileInfo.mime, extension: fileInfo.ext };
};

export * from 'util';
