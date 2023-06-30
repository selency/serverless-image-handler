import {parse} from 'url';
import {ImageRequest} from "../../image-request";
import S3 from "aws-sdk/clients/s3";
import SecretsManager from "aws-sdk/clients/secretsmanager";
import {SecretProvider} from "../../secret-provider";

describe('convertPathToBase64', () => {
  const s3Client = new S3();
  const secretsManager = new SecretsManager();
  const secretProvider = new SecretProvider(secretsManager);
  process.env.SOURCE_BUCKETS = 'ap-selency-sih';

  test('should parse URL with valid params', () => {
    const event = {
      path: "/IMG_ID?width=100&height=200",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, 'base64').toString('utf-8'));

    expect(path).toEqual({
      bucket: 'ap-selency-sih',
      key: 'IMG_ID',
      edits: {
        width: '100',
        height: '200',
      },
    });
  });

  test('should ignore unsupported params', () => {
    const event = {
      path: "/IMG_ID?width=100&height=200&unsupported=300",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, 'base64').toString('utf-8'));

    expect(path).toEqual({
      bucket: 'ap-selency-sih',
      key: 'IMG_ID',
      edits: {
        width: '100',
        height: '200',
      },
    });
  });

  test('should return empty object for URL without params', () => {
    const event = {
      path: "/IMG_ID",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, 'base64').toString('utf-8'));

    expect(path).toEqual({
        bucket: 'ap-selency-sih',
        key: 'IMG_ID',
        edits: {},
      },
    );
  });

  test('should parse URL with additional segment and params', () => {
    const event = {
      path: '/IMG_ID/something-i-want-to-ignore?width=300&height=200',
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, 'base64').toString('utf-8'));

    expect(path).toEqual({
      bucket: 'ap-selency-sih',
      key: 'IMG_ID',
      edits: {
        width: '300',
        height: '200',
      },
    });
  });
});
