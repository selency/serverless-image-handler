// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type YesNo = "Yes" | "No";

export interface SolutionConstructProps {
  readonly convertPathToBase64: YesNo;
  readonly corsEnabled: string;
  readonly corsOrigin: string;
  readonly sourceBuckets: string;
  readonly deployUI: YesNo;
  readonly logRetentionPeriod: number;
  readonly autoWebP: string;
  readonly enableSignature: YesNo;
  readonly secretsManager: string;
  readonly secretsManagerKey: string;
  readonly enableDefaultFallbackImage: YesNo;
  readonly fallbackImageS3Bucket: string;
  readonly fallbackImageS3KeyBucket: string;
  readonly cloudfrontDomainNames: string[];
  readonly cloudfrontCertificateArn: string;
}
