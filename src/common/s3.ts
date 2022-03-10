import { S3 } from 'aws-sdk';

const { IMAGES_BUCKET_NAME } = process.env;

const service = new S3();

const s3 = {
  async save(
    data: Buffer,
    name: string,
    type: string,
    ext: string
  ): Promise<{ URI: string }> {
    const params: S3.Types.PutObjectRequest = {
      Body: data,
      Key: `${name}.${ext}`,
      ContentType: type,
      Bucket: IMAGES_BUCKET_NAME,
      ACL: 'public-read'
    };

    await service.putObject(params).promise();
    return {
      URI: `https://${IMAGES_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`
    };
  }
};

export default s3;
