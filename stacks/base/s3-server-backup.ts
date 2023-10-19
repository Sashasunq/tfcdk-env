import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { S3Bucket } from '@cdktf/provider-aws/lib/s3-bucket';
import { S3BucketPublicAccessBlock } from '@cdktf/provider-aws/lib/s3-bucket-public-access-block';
import { S3BucketServerSideEncryptionConfigurationA } from '@cdktf/provider-aws/lib/s3-bucket-server-side-encryption-configuration';

export class S3ServerBackupStack extends Construct {
    public bucket: S3Bucket;

    constructor(scope: Construct, id: string, env: BaseEnvironment) {
        super(scope, id);

        this.bucket = new S3Bucket(this, `s3-bucket-server-backup`, {
            bucket: `${env.name}-server-backup`,
        });

        new S3BucketServerSideEncryptionConfigurationA(this, `s3-bucket-server-encryption`, {
            bucket: this.bucket.id,
            rule: [
                {
                    applyServerSideEncryptionByDefault: {
                        sseAlgorithm: 'AES256',
                    },
                },
            ],
        });

        new S3BucketPublicAccessBlock(this, `s3-bucket-server-public-block`, {
            bucket: this.bucket.id,
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        });
    }
}
