import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DynamodbTable } from '@cdktf/provider-aws/lib/dynamodb-table';
import { S3Bucket } from '@cdktf/provider-aws/lib/s3-bucket';
import { S3BucketPublicAccessBlock } from '@cdktf/provider-aws/lib/s3-bucket-public-access-block';
import { S3BucketServerSideEncryptionConfigurationA } from '@cdktf/provider-aws/lib/s3-bucket-server-side-encryption-configuration';
import { S3BucketVersioningA } from '@cdktf/provider-aws/lib/s3-bucket-versioning';

export class RemoteBackendStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment) {
        super(scope, id);

        const bucket = new S3Bucket(this, `remote-backend-s3`, {
            bucket: env.terraformBackend.bucket,
        });

        new S3BucketVersioningA(this, `remote-backend-s3-versioning`, {
            bucket: bucket.id,
            versioningConfiguration: {
                status: 'Enabled',
            },
        });

        new S3BucketServerSideEncryptionConfigurationA(this, `remote-backend-s3-encryption`, {
            bucket: bucket.id,
            rule: [
                {
                    applyServerSideEncryptionByDefault: {
                        sseAlgorithm: 'AES256',
                    },
                },
            ],
        });

        new S3BucketPublicAccessBlock(this, `remote-backend-s3-public-block`, {
            bucket: bucket.id,
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        });

        new DynamodbTable(this, `remote-backend-dynamodb`, {
            name: env.terraformBackend.dynamodbTable || `${env.name}-lock-table`,
            billingMode: 'PAY_PER_REQUEST',
            hashKey: 'LockID',
            attribute: [
                {
                    name: 'LockID',
                    type: 'S',
                },
            ],
        });
    }
}
