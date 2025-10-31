import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  s3ForcePathStyle: false,
});

export async function generatePresignedUploadUrl(
  fileName: string,
  fileType: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  // Sanitize filename: replace spaces with dashes and remove special characters
  const sanitizedFileName = fileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
  const key = `stickers/${Date.now()}-${sanitizedFileName}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  const params = {
    Bucket: bucketName,
    Key: key,
    Expires: 300, // 5 minutes
    ContentType: fileType,
    // ACL removed - use bucket policy for public access instead
  };

  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
  
  // Use consistent URL format with region
  const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}`;

  return { uploadUrl, fileUrl };
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const key = fileUrl.split('.amazonaws.com/')[1];

  if (!key) {
    throw new Error('Invalid file URL');
  }

  await s3.deleteObject({
    Bucket: bucketName,
    Key: key,
  }).promise();
}

