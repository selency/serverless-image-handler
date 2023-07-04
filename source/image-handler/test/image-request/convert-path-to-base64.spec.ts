import { ImageRequest } from "../../image-request";
import S3 from "aws-sdk/clients/s3";
import SecretsManager from "aws-sdk/clients/secretsmanager";
import { SecretProvider } from "../../secret-provider";

describe("convertPathToBase64", () => {
  const s3Client = new S3();
  const secretsManager = new SecretsManager();
  const secretProvider = new SecretProvider(secretsManager);
  process.env.SOURCE_BUCKETS = "ap-selency-sih";

  test("should parse URL with valid height and width params", () => {
    const event = {
      path: "/IMG_KEY?width=100&height=200",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, "base64").toString("utf-8"));

    expect(path).toEqual({
      bucket: "ap-selency-sih",
      key: "IMG_KEY",
      edits: {
        rotate: null,
        resize: {
          width: "100",
          height: "200",
          fit: "cover",
        },
      },
    });
  });

  test("should parse URL with valid h, w, bgColor and translate them", () => {
    const event = {
      path: "/IMG_KEY?w=100&h=200&bgColor=F5F5F5",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, "base64").toString("utf-8"));

    expect(path).toEqual({
      bucket: "ap-selency-sih",
      key: "IMG_KEY",
      edits: {
        rotate: null,
        resize: {
          width: "100",
          height: "200",
          fit: "cover",
        },
        flatten: {
          background: {
            r: 245,
            g: 245,
            b: 245,
            alpha: null,
          },
        },
      },
    });
  });

  test("should ignore unsupported params", () => {
    const event = {
      path: "/IMG_KEY?width=100&height=200&unsupported=300",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, "base64").toString("utf-8"));

    expect(path).toEqual({
      bucket: "ap-selency-sih",
      key: "IMG_KEY",
      edits: {
        rotate: null,
        resize: {
          width: "100",
          height: "200",
          fit: "cover",
        },
      },
    });
  });

  test("should return empty edits for URL without params", () => {
    const event = {
      path: "/IMG_KEY",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, "base64").toString("utf-8"));

    expect(path).toEqual({
      bucket: "ap-selency-sih",
      key: "IMG_KEY",
      edits: {
        rotate: null,
      },
    });
  });

  test("should parse URL with additional segment and params", () => {
    const event = {
      path: "/IMG_KEY/something-i-want-to-ignore?width=100&height=200",
    };

    const imageRequest = new ImageRequest(s3Client, secretProvider);
    imageRequest.convertPathToBase64(event);

    const path = JSON.parse(Buffer.from(event.path, "base64").toString("utf-8"));

    expect(path).toEqual({
      bucket: "ap-selency-sih",
      key: "IMG_KEY",
      edits: {
        rotate: null,
        resize: {
          width: "100",
          height: "200",
          fit: "cover",
        },
      },
    });
  });
});
