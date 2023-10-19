import {
    AmqpConfig,
    ElastiCacheConfig,
    M2pSlotConfig,
    MemoryDbConfig,
    MicroServiceConfig,
    RdsConfig,
    RootDnsConfig,
    SaltConfig,
    VpcConfig,
    WebserverPoolConfig,
} from './base-environment';

import { Production } from './production';
import { S3BackendConfig } from 'cdktf';

export class Acceptance extends Production {
    public get name(): string {
        return 'whow-acceptance';
    }

    public get awsAccountId(): string {
        return '537326000994';
    }

    public get terraformBackend(): S3BackendConfig {
        return {
            bucket: 'whow-staging-terraform-state',
            key: 'terraform.tfstate',
            region: 'eu-central-1',
            encrypt: true,
            dynamodbTable: 'whow-staging-lock-table',
        };
    }

    public get vpcConfig(): VpcConfig {
        return {
            cidr: '10.128.0.0/16',
            singleNatGateway: true,
            publicSubnets: [
                { availabilityZone: 'eu-central-1a', cidr: '10.128.0.0/20' },
                { availabilityZone: 'eu-central-1b', cidr: '10.128.16.0/20' },
                { availabilityZone: 'eu-central-1c', cidr: '10.128.32.0/20' },
            ],
            privateSubnets: [
                { availabilityZone: 'eu-central-1a', cidr: '10.128.48.0/20' },
                { availabilityZone: 'eu-central-1b', cidr: '10.128.64.0/20' },
                { availabilityZone: 'eu-central-1c', cidr: '10.128.80.0/20' },
            ],
        };
    }

    public get rootDns(): RootDnsConfig {
        return {
            dnsName: 'aws-acceptance.whowsrv.net',
        };
    }

    public get amiDebian11(): string {
        return 'ami-0007189550431f447';
    }

    public get saltConfig(): SaltConfig {
        return {
            env: 'production',
            region: 'eu-central-1',
        };
    }

    public instanceType(_instanceType: string): string {
        return 't3.micro';
    }

    public dbInstanceClass(_instanceClass: string): string {
        return 'db.t3.micro';
    }

    public elastiCacheInstanceClass(_instanceClass: string): string {
        return 'cache.t4g.micro';
    }

    public memoryDbInstanceClass(_instanceClass: string): string {
        return `db.t4g.small`;
    }

    public get rdsConfigs(): RdsConfig[] {
        return [
            {
                name: 'suite-98-mysql-01',
                instanceType: 'db.m5.xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
        ];
    }

    public get elastiCacheConfigs(): ElastiCacheConfig[] {
        return [
            {
                type: 'memcached',
                name: 'suite-98-session',
                instanceType: 'cache.m6g.large',
                nodes: 1,
            },
        ];
    }

    public get memoryDbConfigs(): MemoryDbConfig[] {
        return [
            {
                name: 'suite-98-memorydb',
                instanceType: 'db.r6g.xlarge',
                shards: 1,
                replicas: 1,
            },
        ];
    }

    public get amqpConfigs(): AmqpConfig[] {
        return [super.amqpConfigs[1]];
    }

    public get microServiceConfigs(): MicroServiceConfig[] {
        return [
            /*
            {
                name: 'competitions2-65',
                instanceType: 'c6a.xlarge',
                publicNodes: 1,
                privateNodes: 1,
            },
            */
            {
                name: 'arcadegames-112',
                instanceType: 'c6a.large',
                privateNodes: 1,
                lbTarget: true,
            },
        ];
    }

    public get webserverPools(): WebserverPoolConfig[] {
        return [
            // PRODUCTION
            {
                name: 'pool-01',
                instanceType: 'c6a.2xlarge',
                diskType: 'gp3',
                diskSize: 30,
                minSize: 3,
                maxSize: 6,
            },
            {
                name: 'pool-02',
                instanceType: 'c6a.2xlarge',
                diskType: 'gp3',
                diskSize: 30,
                minSize: 3,
                maxSize: 6,
            },
            {
                name: 'pool-03',
                instanceType: 'c6a.2xlarge',
                diskType: 'gp3',
                diskSize: 30,
                minSize: 3,
                maxSize: 6,
            },
            {
                name: 'pool-05',
                instanceType: 'c6a.2xlarge',
                diskType: 'gp3',
                diskSize: 30,
                minSize: 3,
                maxSize: 6,
            },
            {
                name: 'pool-07',
                instanceType: 'c6a.2xlarge',
                diskType: 'gp3',
                diskSize: 30,
                minSize: 3,
                maxSize: 6,
            },
            // STAGING
            /*
            {
                name: 'pool-staging7',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 150,
                minSize: 3,
                maxSize: 6,
            },
            {
                name: 'pool-staging8',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 150,
                minSize: 3,
                maxSize: 6,
            },
            */
        ];
    }

    public get m2pSlots(): M2pSlotConfig[] {
        return [
            {
                name: 'm2pslots-103-magicmegaplay',
                instanceType: 't3.small',
                domains: ['m2p-magicmegaplay.whow.net'],
            },
            {
                name: 'm2pslots-1103-extremefruits',
                instanceType: 't3.small',
                staging: true,
                domains: ['m2p-stage-extremefruits.whow.net'],
            },
        ];
    }
}
