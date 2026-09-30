import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getAwsSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client, { isS3Configured } from "../config/s3.js";

export const uploadToS3 = async (buffer, key, contentType = "application/pdf") => {
  if (!isS3Configured() || !s3Client) return null;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
};

export const getSignedUrl = async (key, expiresInSeconds = 3600) => {
  if (!isS3Configured() || !s3Client || !key) return null;

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  return getAwsSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};

export const deleteFromS3 = async (key) => {
  if (!isS3Configured() || !s3Client || !key) return null;

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
  return true;
};
