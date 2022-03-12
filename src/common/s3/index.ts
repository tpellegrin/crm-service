import { S3 } from 'aws-sdk';

import { nanoid } from 'nanoid';

const { IMAGES_BUCKET } = process.env;

const service = new S3();

const s3 = {
  async save(data: Buffer, type: string): Promise<{ url: string }> {
    const params: S3.Types.PutObjectRequest = {
      Body: data,
      Key: nanoid(10),
      ContentType: type,
      Bucket: IMAGES_BUCKET,
      ACL: 'public-read'
    };

    await service.putObject(params).promise();
    return {
      url: `https://${IMAGES_BUCKET}.s3.amazonaws.com/${params.Key}`
    };
  },
  async delete(id: string): Promise<void> {
    const params: S3.Types.DeleteObjectRequest = {
      Key: id,
      Bucket: IMAGES_BUCKET
    };

    await service.deleteObject(params).promise();
  }
};

export default s3;
