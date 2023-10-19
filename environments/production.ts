import {
    AmqpConfig,
    BaseEnvironment,
    ElastiCacheConfig,
    M2pSlotConfig,
    MemoryDbConfig,
    MicroServiceConfig,
    RdsConfig,
    RedisConfig,
    RootDnsConfig,
    SaltConfig,
    VpcConfig,
    WebserverPoolConfig,
} from './base-environment';

import { S3BackendConfig } from 'cdktf';

export class Production extends BaseEnvironment {
    public get name(): string {
        return 'whow-production';
    }

    public get awsAccountId(): string {
        return '789047558701';
    }

    public get terraformBackend(): S3BackendConfig {
        return {
            bucket: `${this.name}-terraform-state`,
            key: 'terraform.tfstate',
            region: 'eu-central-1',
            encrypt: true,
            dynamodbTable: `${this.name}-lock-table`,
        };
    }

    public get vpcConfig(): VpcConfig {
        return {
            cidr: '10.64.0.0/16',
            singleNatGateway: false,
            publicSubnets: [
                { availabilityZone: 'eu-central-1a', cidr: '10.64.0.0/20' },
                { availabilityZone: 'eu-central-1b', cidr: '10.64.16.0/20' },
                { availabilityZone: 'eu-central-1c', cidr: '10.64.32.0/20' },
            ],
            privateSubnets: [
                { availabilityZone: 'eu-central-1a', cidr: '10.64.48.0/20' },
                { availabilityZone: 'eu-central-1b', cidr: '10.64.64.0/20' },
                { availabilityZone: 'eu-central-1c', cidr: '10.64.80.0/20' },
            ],
        };
    }

    public get rootDns(): RootDnsConfig {
        return {
            dnsName: 'aws.whowsrv.net',
        };
    }

    public get amiDebian11(): string {
        return 'ami-083e74a8d0231d93e';
    }

    public get saltConfig(): SaltConfig {
        return {
            env: 'production',
            region: 'eu-central-1',
        };
    }

    public instanceType(instanceType: string): string {
        return instanceType;
    }

    public dbInstanceClass(instanceClass: string): string {
        return instanceClass;
    }

    public elastiCacheInstanceClass(instanceClass: string): string {
        return instanceClass;
    }

    public memoryDbInstanceClass(instanceClass: string): string {
        return instanceClass;
    }

    public get rdsConfigs(): RdsConfig[] {
        return [
            // TEST
            /*
            {
                name: 'test-123',
                instanceType: 'db.t3.micro',
                diskType: 'gp3',
                diskSize: 20,
            },
            */
            // PRODUCTION
            {
                name: 'achievements-114-mysql-01',
                instanceType: 'db.r5.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'achievements-114-mysql-02',
                instanceType: 'db.r5.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'achievements-114-mysql-03',
                instanceType: 'db.r5.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'achievements-114-mysql-04',
                instanceType: 'db.r5.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'arcadegames-112-mysql-01',
                instanceType: 'db.t3.medium',
                diskType: 'gp3',
                diskSize: 20,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'authglobaldatasrvdb-mysql-01',
                instanceType: 'db.t3.small',
                diskType: 'gp3',
                diskSize: 20,
                parameterGroup: 'default.mysql8.0',
                engineVersion: '8.0',
            },
            {
                name: 'brazepipe-93-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 30,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'clubs-104-mysql-01',
                instanceType: 'db.r5.xlarge',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'competitions-and-highrollerduell-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'contentcontrol-110-mysql-01',
                instanceType: 'db.t3.small',
                diskType: 'gp3',
                diskSize: 20,
                parameterGroup: 'default.mysql8.0',
                engineVersion: '8.0',
            },
            {
                name: 'idleslot-111-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'journey3-38-mysql-01',
                instanceType: 'db.r5.xlarge',
                diskType: 'gp3',
                diskSize: 300,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'jpevents-96-mysql-01',
                instanceType: 'db.r5.xlarge',
                diskType: 'gp3',
                diskSize: 300,
                parameterGroup: 'whow-mysql57-jpevents-96-mysql-01',
                allowDataDeptAccess: true,
            },
            {
                name: 'jpfeatures-113-mysql-01',
                instanceType: 'db.m5.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-jpfeatures-113-mysql-01',
                allowDataDeptAccess: true,
            },
            {
                name: 'jpmailbox-116-mysql-01',
                instanceType: 'db.m5.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'layertool-37-mysql-01',
                instanceType: 'db.t3.small',
                diskType: 'gp3',
                diskSize: 20,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'leaderboard2-27-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'league2-56-mysql-01',
                instanceType: 'db.m5.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'm2pslots-103-mysql-01',
                instanceType: 'db.m5.large',
                diskType: 'gp3',
                diskSize: 600,
            },
            {
                name: 'mailgateway-92-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'offerai-54-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'default.mysql8.0',
                engineVersion: '8.0',
            },
            {
                name: 'payment-39-mysql-01',
                instanceType: 'db.r5.xlarge',
                diskType: 'gp3',
                diskSize: 150,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'personaljackpots-89-mysql-01',
                instanceType: 'db.r5.2xlarge',
                diskType: 'gp3',
                diskSize: 1200,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'premiumshop-86-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 150,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'prizetool-41-mysql-01',
                instanceType: 'db.t3.small',
                diskType: 'gp3',
                diskSize: 20,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'publisherproxy-97-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'sharedstorage-28-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'suite-98-mysql-01',
                instanceType: 'db.m5.4xlarge',
                diskType: 'gp3',
                diskSize: 1500,
                parameterGroup: 'whow-mysql57-suite-98-mysql-01',
                allowDataDeptAccess: true,
            },
            {
                name: 'suite-98-mysql-02',
                instanceType: 'db.m5.12xlarge',
                diskType: 'gp3',
                diskSize: 300,
                parameterGroup: 'whow-mysql57-suite-98-mysql-02',
                allowDataDeptAccess: true,
            },
            {
                name: 'suite-98-mysql-03',
                instanceType: 'db.m5.4xlarge',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-suite-98-mysql-03',
            },
            {
                name: 'suite-98-mysql-stats',
                instanceType: 'db.m5.4xlarge',
                diskType: 'gp3',
                diskSize: 500,
                parameterGroup: 'whow-mysql57-suite-98-mysql-stats',
                allowDataDeptAccess: true,
            },
            {
                name: 'symbols-102-mysql-01',
                instanceType: 'db.r5.4xlarge',
                diskType: 'gp3',
                diskSize: 300,
                parameterGroup: 'whow-mysql57-symbols-102-mysql-01',
                allowDataDeptAccess: true,
            },
            {
                name: 'tpixeltool-49-mysql-01',
                instanceType: 'db.t3.small',
                diskType: 'gp3',
                diskSize: 20,
            },
            {
                name: 'treasurehunt-76-mysql-01',
                instanceType: 'db.m5.8xlarge',
                diskType: 'gp3',
                diskSize: 300,
                parameterGroup: 'whow-mysql57-treasurehunt-76-mysql-01',
            },
            {
                name: 'usercom2-25-mysql-01',
                instanceType: 'db.t3.large',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-optimized',
                allowDataDeptAccess: true,
            },
            {
                name: 'whowset-90-mysql-01',
                instanceType: 'db.t3.xlarge',
                diskType: 'gp3',
                diskSize: 100,
                parameterGroup: 'whow-mysql57-optimized',
            },
            {
                name: 'whownet-64-mysql-01',
                instanceType: 'db.t3.micro',
                diskType: 'gp3',
                diskSize: 20,
            },
            // RETROCASINO - PRODUCTION
            {
                name: 'retrocasino-105-mysql-01',
                instanceType: 'db.t3.medium',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'tigerking-119-mysql-01',
                instanceType: 'db.t3.medium',
                diskType: 'gp3',
                diskSize: 30,
            },
            // STAGING
            {
                name: 'staging-mysql',
                instanceType: 'db.t3.medium',
                diskType: 'gp3',
                diskSize: 50,
                parameterGroup: 'whow-mysql57-staging-optimized',
                proxy: true,
            },
        ];
    }

    public get elastiCacheConfigs(): ElastiCacheConfig[] {
        return [
            // PRODUCTION
            {
                type: 'memcached',
                name: 'suite-98-session',
                instanceType: 'cache.m6g.large',
                nodes: 3,
            },
            {
                type: 'memcached',
                name: 'suite-98-memcache',
                instanceType: 'cache.m6g.large',
                nodes: 3,
            },
            {
                type: 'memcached',
                name: 'payment-39-memcache',
                instanceType: 'cache.t4g.small',
                nodes: 1,
            },
            {
                type: 'memcached',
                name: 'misc-memcache',
                instanceType: 'cache.t4g.micro',
                nodes: 1,
            },
            // RETROCASINO - PRODUCTION
            {
                type: 'memcached',
                name: 'retrocasino-105-session',
                instanceType: 'cache.t4g.micro',
                nodes: 1,
            },
            {
                type: 'memcached',
                name: 'retrocasino-105-memcache',
                instanceType: 'cache.t4g.micro',
                nodes: 1,
            },
            // STAGING
            {
                type: 'memcached',
                name: 'staging-memcache',
                instanceType: 'cache.t4g.small',
                nodes: 1,
            },
            {
                type: 'memcached',
                name: 'staging-session',
                instanceType: 'cache.t4g.small',
                nodes: 1,
            },
        ];
    }

    public get redisConfigs(): RedisConfig[] {
        return [
            // PRODUCTION
            {
                name: 'achievements-114-redis-01',
                instanceType: 't3a.xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'achievements-114-redis-02',
                instanceType: 't3a.xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'achievements-114-redis-03',
                instanceType: 't3a.xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'achievements-114-redis-04',
                instanceType: 't3a.xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'arcadegames-112-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'clubs-104-redis',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'competitions2-65-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'competitions3-65-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'highrollerduell-107-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'idleslot-111-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'jpevents-96-redis',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'jpfeatures-113-redis',
                instanceType: 'r5.xlarge',
                diskType: 'gp3',
                diskSize: 100,
            },
            {
                name: 'journey3-38-redis',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'leaderboard2-27-redis',
                instanceType: 't3a.xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'league2-56-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'offerai-54-redis-01',
                instanceType: 't3a.xlarge',
                diskType: 'gp3',
                diskSize: 40,
            },
            {
                name: 'personaljackpots-89-redis',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 40,
            },
            {
                name: 'suite-98-redis-01',
                instanceType: 'r5.2xlarge',
                diskType: 'gp3',
                diskSize: 100,
                diskThroughput: 250,
            },
            {
                name: 'symbols-102-redis',
                instanceType: 't3a.2xlarge',
                diskType: 'gp3',
                diskSize: 30,
            },
            {
                name: 'tigerking-119-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
            // INFRASTRUCTURE
            {
                name: 'whowset-90-redis',
                instanceType: 't3a.small',
                diskType: 'gp3',
                diskSize: 30,
            },
        ];
    }

    public get memoryDbConfigs(): MemoryDbConfig[] {
        return [
            // PRODUCTION
            /*
            {
                name: 'suite-98-memorydb',
                instanceType: 'db.r6g.xlarge',
                shards: 1,
                replicas: 1,
            },
            {
                name: 'microservices-memorydb',
                instanceType: 'db.r6g.large',
                shards: 1,
                replicas: 1,
            },
            */
            // RETROCASINO - PRODUCTION
            /*
            {
                name: 'retrocasino-105-memorydb',
                instanceType: 'db.t4g.small',
                shards: 1,
                replicas: 1,
            },
            */
            // STAGING
            /*
            {
                name: 'staging-memorydb',
                instanceType: 'db.t4g.small',
                shards: 1,
                replicas: 0,
            },
            */
        ];
    }

    public get amqpConfigs(): AmqpConfig[] {
        const amqpConfigs: AmqpConfig[] = [];

        // PRODUCTION
        for (let i = 1; i < 15; i++) {
            const instanceNumber = String(i).padStart(2, '0');

            amqpConfigs.push({
                name: `amqp-35-${instanceNumber}`,
                instanceType: 'c5.2xlarge',
                diskType: 'gp3',
                diskSize: 100,
            });
        }

        // STAGING
        amqpConfigs.push({
            name: `amqp-1035-01`,
            instanceType: 't3a.medium',
            diskType: 'gp3',
            diskSize: 100,
        });

        return amqpConfigs;
    }

    public get microServiceConfigs(): MicroServiceConfig[] {
        return [
            // PRODUCTION
            {
                name: 'achievements-114',
                instanceType: 'c5.xlarge',
                privateNodes: 6,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-achievements',
                            symbolic: true,
                        },
                        {
                            name: 'achievements-114-node-{{instanceNumber}}',
                            global: true,
                        },

                        {
                            name: 'achievements-114-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'arcadegames-112',
                instanceType: 'c6a.large',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'arcadegames-112-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'arcadegames-112-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'balancelogs-94',
                instanceType: 't3a.large',
                privateNodes: 2,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'balancelogs-94-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'brazepipe-93',
                instanceType: 't3a.large',
                privateNodes: 1,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'brazepipe-93-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'casinosocket-74',
                instanceType: 'c5.xlarge',
                publicNodes: 4,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-casinosocket',
                            symbolic: true,
                        },
                        {
                            name: 'casinosocket-74-shard-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'casinosocket-74-shard-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'clubs-104',
                instanceType: 'c5.xlarge',
                privateNodes: 3,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-clubs',
                            symbolic: true,
                        },
                        {
                            name: 'clubs-104-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'clubs-104-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'competitions2-65',
                instanceType: 't3a.large',
                publicNodes: 1,
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-competitions2',
                            symbolic: true,
                        },
                        {
                            name: 'competitions2-65-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'competitions2-65-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'competitions3-65',
                instanceType: 't3a.large',
                publicNodes: 4,
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-competitions3',
                            symbolic: true,
                        },
                        {
                            name: 'competitions3-65-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'competitions3-65-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'contentcontrol-110',
                instanceType: 't3a.medium',
                privateNodes: 1,
                lbTarget: true,
                lbTargetPort: 80,
                lbTargetHealthCheck: {
                    enabled: true,
                    protocol: 'HTTP',
                    port: '8275',
                    path: '/check.php',
                },
                bootstrap: {
                    roles: ['nodejs', 'webserver'],
                    services: [
                        {
                            name: 'contentcontrol-110-node-01',
                            global: true,
                        },
                        {
                            name: 'contentcontrol-110-acp',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'gameevents-78',
                instanceType: 'c6a.large',
                privateNodes: 4,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'gameevents-78-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'gamesessions-80',
                instanceType: 'c6a.xlarge',
                privateNodes: 16,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'gamesessions-80-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'highrollerduell-65',
                instanceType: 't3a.large',
                publicNodes: 1,
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-highrollerduell',
                            symbolic: true,
                        },
                        {
                            name: 'highrollerduell-107-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'highrollerduell-107-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'idleslot-111',
                instanceType: 'c5.large',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-idleslot',
                            symbolic: true,
                        },
                        {
                            name: 'idleslot-111-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'idleslot-111-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'journey3-38',
                instanceType: 'c5.2xlarge',
                privateNodes: 2,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-journey3',
                            symbolic: true,
                        },
                        {
                            name: 'journey3-38-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'journey3-38-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'jpevents-96',
                instanceType: 'c5.2xlarge',
                privateNodes: 2,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-jpevents',
                            symbolic: true,
                        },
                        {
                            name: 'jpevents-96-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'jpevents-96-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'jpfeatures-113',
                instanceType: 'c5.xlarge',
                privateNodes: 4,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-jpfeatures',
                            symbolic: true,
                        },
                        {
                            name: 'jpfeatures-113-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'jpfeatures-113-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'jpmailbox-116',
                instanceType: 'c5.large',
                privateNodes: 2,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-jpmailbox',
                            symbolic: true,
                        },
                        {
                            name: 'jpmailbox-116-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'jpmailbox-116-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'leaderboard2-27',
                instanceType: 'c5.large',
                privateNodes: 2,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-leaderboard2',
                            symbolic: true,
                        },
                        {
                            name: 'leaderboard2-27-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'leaderboard2-27-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'league2-56',
                instanceType: 'c5.large',
                privateNodes: 2,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-league2',
                            symbolic: true,
                        },
                        {
                            name: 'league2-56-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'league2-56-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'mailgateway-92',
                instanceType: 't3a.medium',
                privateNodes: 2,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'mailgateway-92-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'mqrepli-52',
                instanceType: 'c6a.xlarge',
                privateNodes: 2,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'mqrepli-52-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'offerai-54',
                instanceType: 'c5.xlarge',
                privateNodes: 1,
                lbTarget: true,
                lbTargetPort: 80,
                lbTargetHealthCheck: {
                    enabled: true,
                    protocol: 'HTTP',
                    port: '8275',
                    path: '/check.php',
                },
                bootstrap: {
                    roles: ['webserver', 'nodejs'],
                    services: [
                        {
                            name: 'offerai-54-node-01',
                            global: true,
                        },
                        {
                            name: 'offerai2server-67-node-01',
                            global: true,
                        },
                        {
                            name: 'offerai2acp-68-www',
                            global: true,
                        },
                        {
                            name: 'offerai2acp-68-acp',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'personaljackpots-89',
                instanceType: 'c5.xlarge',
                privateNodes: 8,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-personaljackpots',
                            symbolic: true,
                        },
                        {
                            name: 'personaljackpots-89-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'personaljackpots-89-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'premiumshop-86',
                instanceType: 'c5.xlarge',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy-loopback', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-premiumshop',
                            symbolic: true,
                        },
                        {
                            name: 'premiumshop-86-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'premiumshop-86-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'publisherproxy-97',
                instanceType: 'c6a.large',
                privateNodes: 2,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'publisherproxy-97-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'symbols-102',
                instanceType: 'c5.4xlarge',
                privateNodes: 5,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-symbols',
                            symbolic: true,
                        },
                        {
                            name: 'symbols-102-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'symbols-102-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            {
                name: 'treasurehunt2-76',
                instanceType: 'c5.xlarge',
                privateNodes: 4,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'hlb-treasurehunt2',
                            symbolic: true,
                        },
                        {
                            name: 'treasurehunt2-76-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-01i4xne67gdzdj',
                },
            },
            // INFRASTRUCTUR / TOOLS
            {
                name: 'crwdtool-46',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                lbTargetPort: 80,
                lbTargetHealthCheck: {
                    enabled: true,
                    protocol: 'HTTP',
                    port: '8275',
                    path: '/check.php',
                },
                volumeSize: 50,
                bootstrap: {
                    roles: ['webserver'],
                    services: [
                        {
                            name: 'crwdtool',
                            global: true,
                        },
                        {
                            name: 'crwdtool-46-www',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-012788m5147yux',
                },
            },
            {
                name: 'tpixeltool-49',
                instanceType: 't3a.medium',
                privateNodes: 1,
                lbTarget: true,
                lbTargetPort: 80,
                lbTargetHealthCheck: {
                    enabled: true,
                    protocol: 'HTTP',
                    port: '8275',
                    path: '/check.php',
                },
                bootstrap: {
                    roles: ['webserver'],
                    services: [
                        {
                            name: 'tpixeltool-49-cron-01',
                            global: true,
                        },
                        {
                            name: 'tpixeltool-49-acp',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-012788m5147yux',
                },
            },
            {
                name: 'whowset-90',
                instanceType: 't3a.xlarge',
                publicNodes: 1,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'whowset-90-node-01',
                            global: true,
                        },
                        {
                            name: 'whowset',
                            global: true,
                            public: true,
                        },
                    ],
                },
                additionalSecurityGroups: ['http', 'http-alt'],
                additionalTags: {
                    'map-migrated': 'd-server-012788m5147yux',
                },
            },
            // RETROCASINO PRODUCTION
            {
                name: 'retrinocasino-105-socket',
                instanceType: 't3a.small',
                publicNodes: 2,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'hlb-retrocasino-socket',
                            symbolic: true,
                        },
                        {
                            name: 'retrocasino-105-socket-{{instanceNumber}}',
                            public: true,
                            global: true,
                        },
                        {
                            name: 'retrocasino-105-socket-01-internal',
                            global: true,
                        },
                    ],
                },
            },
            // STAGING
            {
                name: 'achievements-1114',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-achievements',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-achievements',
                            global: true,
                        },
                        {
                            name: 'achievements-1114-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'arcadegames-1112',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'staging-arcadegames',
                            global: true,
                        },
                        {
                            name: 'arcadegames-1112-node-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'arcadegames-1112-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'balancelogs-1094',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'staging-balancelogs',
                            global: true,
                        },
                        {
                            name: 'balancelogs-1094-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'cardworlds-1117',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-cardworlds',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-cardworlds',
                            global: true,
                        },
                        {
                            name: 'cardworlds-1117-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'casinosocket-1074',
                instanceType: 't3a.small',
                publicNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-casinosocket',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-casinosocket',
                            global: true,
                        },
                        {
                            name: 'casinosocket-1074-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'casinosocket-1074-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                        {
                            name: 'casinosockjs-1023-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'clubs-1104',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-clubs',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-clubs',
                            global: true,
                        },
                        {
                            name: 'clubs-1104-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'competitions2-1065',
                instanceType: 't3a.small',
                privateNodes: 1,
                publicNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-competitions2-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-competitions2',
                            symbolic: true,
                        },
                        {
                            name: 'competitions2-1065-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'competitions2-1065-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'competitions3-1065',
                instanceType: 't3a.small',
                privateNodes: 1,
                publicNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-competitions3-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-competitions3',
                            symbolic: true,
                        },
                        {
                            name: 'competitions3-1065-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'competitions3-1065-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'gameevents-1078',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'staging-gameevents',
                            global: true,
                        },
                        {
                            name: 'gameevents-1078-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'gamesessions-1080',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'staging-gamesessions',
                            global: true,
                        },
                        {
                            name: 'gamesessions-1080-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'highrollerduell-1107',
                instanceType: 't3a.small',
                privateNodes: 1,
                publicNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-highrollerduell-{{instanceNumber}}',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-highrollerduell',
                            symbolic: true,
                        },
                        {
                            name: 'highrollerduell-1107-node-{{instanceNumber}}',
                            global: true,
                            public: true,
                        },
                        {
                            name: 'highrollerduell-1107-node-{{instanceNumber}}-internal',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'idleslot-1111',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-idleslot',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-idleslot',
                            symbolic: true,
                        },
                        {
                            name: 'idleslot-1111-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'journey3-1038',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-journey3',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-journey3',
                            symbolic: true,
                        },
                        {
                            name: 'journey3-1038-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'journey4-1038',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-journey4',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-journey4',
                            symbolic: true,
                        },
                        {
                            name: 'journey4-1038-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'jpevents-1096',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-jpevents',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-jpevents',
                            symbolic: true,
                        },
                        {
                            name: 'jpevents-1096-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'jpfeatures-1113',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-jpfeatures',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-jpfeatures',
                            symbolic: true,
                        },
                        {
                            name: 'jpfeatures-1113-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'jpmailbox-1116',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-jpmailbox',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-jpmailbox',
                            symbolic: true,
                        },
                        {
                            name: 'jpmailbox-1116-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'leaderboard2-1027',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-leaderboard2',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-leaderboard2',
                            symbolic: true,
                        },
                        {
                            name: 'leaderboard2-1027-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'league2-1065',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-league2',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-league2',
                            symbolic: true,
                        },
                        {
                            name: 'league2-1056-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'mqrepli-1052',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-mqrepli',
                            global: true,
                        },
                        {
                            name: 'mqrepli-1052-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'offerai-1054',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                lbTargetPort: 80,
                lbTargetHealthCheck: {
                    enabled: true,
                    protocol: 'HTTP',
                    port: '8275',
                    path: '/check.php',
                },
                bootstrap: {
                    roles: ['webserver', 'nodejs'],
                    services: [
                        {
                            name: 'staging-offerai',
                            global: true,
                        },
                        {
                            name: 'offerai-1054-node-01',
                            global: true,
                        },
                        {
                            name: 'offerai2server-1067-node-01',
                            global: true,
                        },
                        {
                            name: 'offerai2acp-1068-www',
                            global: true,
                        },
                        {
                            name: 'offerai2acp-1068-acp',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'personaljackpots-1089',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-personaljackpots',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-personaljackpots',
                            symbolic: true,
                        },
                        {
                            name: 'personaljackpots-1089-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'premiumshop-1086',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-premiumshop',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-premiumshop',
                            symbolic: true,
                        },
                        {
                            name: 'premiumshop-1086-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'publisherproxy-1097',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'staging-publisherproxy',
                            global: true,
                        },
                        {
                            name: 'publisherproxy-1097-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'symbols-1102',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-symbols',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-symbols',
                            symbolic: true,
                        },
                        {
                            name: 'symbols-1102-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
            },
            {
                name: 'treasurehunt2-1076',
                instanceType: 't3a.small',
                privateNodes: 1,
                bootstrap: {
                    roles: ['haproxy', 'nodejs'],
                    services: [
                        {
                            name: 'staging-treasurehunt2',
                            global: true,
                        },
                        {
                            name: 'hlb-staging-treasurehunt2',
                            symbolic: true,
                        },
                        {
                            name: 'treasurehunt2-1076-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
            },
            {
                name: 'tigerking-119',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'tigerking-119-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
            },
            {
                name: 'tigerking-1119',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'tigerking-1119-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
            },
            {
                name: 'tigerking-2119',
                instanceType: 't3a.small',
                privateNodes: 1,
                lbTarget: true,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'tigerking-2119-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
            },
            {
                name: 'api-monitoring-122',
                instanceType: 't3a.micro',
                privateNodes: 1,
                bootstrap: {
                    roles: ['nodejs'],
                    services: [
                        {
                            name: 'api-monitoring-122-node-{{instanceNumber}}',
                            global: true,
                        },
                    ],
                },
            },
        ];
    }

    public get webserverPools(): WebserverPoolConfig[] {
        return [
            // PRODUCTION
            {
                name: 'pool-01',
                instanceRequirements: {
                    allowedInstanceTypes: ['c5.*', 'c6a.*', 'c6i.*'],
                    memoryMib: { min: 8 * 1024, max: 16 * 1024 },
                    vcpuCount: { min: 4, max: 8 },
                },
                diskType: 'gp3',
                diskSize: 30,
                additionalTags: {
                    'map-migrated': 'd-server-03jp10ov45jm9t',
                },
                minSize: 105,
                maxSize: 130,
            },
            {
                name: 'pool-02',
                instanceType: 'c5.xlarge',
                diskType: 'gp3',
                diskSize: 30,
                additionalTags: {
                    'map-migrated': 'd-server-03jp10ov45jm9t',
                },
                minSize: 6,
                maxSize: 12,
            },
            {
                name: 'pool-03',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 30,
                additionalTags: {
                    'map-migrated': 'd-server-03jp10ov45jm9t',
                },
                minSize: 3,
                maxSize: 6,
            },
            {
                name: 'pool-05',
                instanceType: 'c5.large',
                diskType: 'gp3',
                diskSize: 30,
                additionalTags: {
                    'map-migrated': 'd-server-03jp10ov45jm9t',
                },
                minSize: 3,
                maxSize: 6,
            },
            // RETROCASINO PRODUCTION
            {
                name: 'pool-06',
                instanceType: 't3a.medium',
                diskType: 'gp3',
                diskSize: 30,
                additionalTags: {
                    'map-migrated': 'd-server-007g7pg1t4duty',
                },
                minSize: 3,
                maxSize: 6,
            },
            // STAGING
            {
                name: 'pool-staging7',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 150,
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
                minSize: 2,
                maxSize: 4,
            },
            {
                name: 'pool-staging8',
                instanceType: 't3a.large',
                diskType: 'gp3',
                diskSize: 150,
                additionalTags: {
                    'map-migrated': 'd-server-008foujw7yyp7q',
                },
                minSize: 2,
                maxSize: 4,
            },
        ];
    }

    public get m2pSlots(): M2pSlotConfig[] {
        return [
            // PRODUCTION
            {
                name: 'm2pslots-103-bookofbuffalo',
                instanceType: 't3a.small',
                domains: ['m2p-bookofbuffalo.whow.net'],
            },
            {
                name: 'm2pslots-103-treasuretales',
                instanceType: 't3a.small',
                domains: ['m2p-treasuretales.whow.net'],
            },
            {
                name: 'm2pslots-103-aztecchallenge',
                instanceType: 't3a.small',
                domains: ['m2p-aztecchallenge.whow.net'],
            },
            {
                name: 'm2pslots-103-cavemanwild',
                instanceType: 't3a.small',
                domains: ['m2p-cavemanwild.whow.net'],
            },
            {
                name: 'm2pslots-103-pickapinata',
                instanceType: 't3a.small',
                domains: ['m2p-pickapinata.whow.net'],
            },
            {
                name: 'm2pslots-103-superfresh7',
                instanceType: 't3a.small',
                domains: ['m2p-superfresh7.whow.net'],
            },
            {
                name: 'm2pslots-103-aladin',
                instanceType: 't3a.small',
                domains: ['m2p-aladin.whow.net'],
            },
            {
                name: 'm2pslots-103-magicmegaplay',
                instanceType: 't3a.small',
                domains: ['m2p-magicmegaplay.whow.net'],
            },
            {
                name: 'm2pslots-103-neonlights',
                instanceType: 't3a.small',
                domains: ['m2p-neonlights.whow.net'],
            },
            {
                name: 'm2pslots-103-vipclub',
                instanceType: 't3a.small',
                domains: ['m2p-vipclub.whow.net'],
            },
            {
                name: 'm2pslots-103-extremefruits',
                instanceType: 't3a.small',
                domains: ['m2p-extremefruits.whow.net'],
            },
            {
                name: 'm2pslots-103-hotwildjokers',
                instanceType: 't3a.small',
                domains: ['m2p-hotwildjokers.whow.net'],
            },
            {
                name: 'm2pslots-103-max7fruits',
                instanceType: 't3a.small',
                domains: ['m2p-max7fruits.whow.net'],
            },
            {
                name: 'm2pslots-103-colorburst',
                instanceType: 't3a.small',
                domains: ['m2p-colorburst.whow.net'],
            },
            {
                name: 'm2pslots-103-gameofcats',
                instanceType: 't3a.small',
                domains: ['m2p-gameofcats.whow.net'],
            },
            {
                name: 'm2pslots-103-caesarcleopatra',
                instanceType: 't3a.medium',
                domains: ['m2p-caesarcleopatra.whow.net'],
            },
            {
                name: 'm2pslots-103-supersummer',
                instanceType: 't3a.small',
                domains: ['m2p-supersummer.whow.net'],
            },
            {
                name: 'm2pslots-103-triggerhappy',
                instanceType: 't3a.small',
                domains: ['m2p-triggerhappy.whow.net'],
            },
            {
                name: 'm2pslots-103-bavarianbeer',
                instanceType: 't3a.small',
                domains: ['m2p-bavarianbeerfest.whow.net'],
            },
            {
                name: 'm2pslots-103-blastingwilds',
                instanceType: 't3a.small',
                domains: ['m2p-blastingwilds.whow.net'],
            },
            {
                name: 'm2pslots-103-winterdreams',
                instanceType: 't3a.small',
                domains: ['m2p-winterdreams.whow.net'],
            },
            {
                name: 'm2pslots-103-dragonlord',
                instanceType: 't3a.small',
                domains: ['m2p-dragonlord.whow.net'],
            },
            {
                name: 'm2pslots-103-vikings',
                instanceType: 't3a.small',
                domains: ['m2p-vikings.whow.net'],
            },
            {
                name: 'm2pslots-103-jinxyjewels',
                instanceType: 't3a.small',
                domains: ['m2p-jinxyjewels.whow.net'],
            },
            {
                name: 'm2pslots-103-rebound',
                instanceType: 't3a.small',
                domains: ['m2p-rebound.whow.net'],
            },
            {
                name: 'm2pslots-103-tequilasunrise',
                instanceType: 't3a.small',
                domains: ['m2p-tequilasunrise.whow.net'],
            },
            {
                name: 'm2pslots-103-miamiwild',
                instanceType: 't3a.small',
                domains: ['m2p-miamiwild.whow.net'],
            },
            {
                name: 'm2pslots-103-neptuneinlove',
                instanceType: 't3a.small',
                domains: ['m2p-neptuneinlove.whow.net'],
            },
            {
                name: 'm2pslots-103-pinkdiamond',
                instanceType: 't3a.small',
                domains: ['m2p-pinkdiamond.whow.net'],
            },
            {
                name: 'm2pslots-103-bloodnight',
                instanceType: 't3a.small',
                domains: ['m2p-bloodnight.whow.net'],
            },
            {
                name: 'm2pslots-103-cashflash',
                instanceType: 't3a.small',
                domains: ['m2p-cashflash.whow.net'],
            },
            {
                name: 'm2pslots-103-spqr',
                instanceType: 't3a.small',
                domains: ['m2p-spqr.whow.net'],
            },
            {
                name: 'm2pslots-103-toinofgold',
                instanceType: 't3a.small',
                domains: ['m2p-toinofgold.whow.net'],
            },
            {
                name: 'm2pslots-103-vikingssecmagic',
                instanceType: 't3a.small',
                domains: ['m2p-vikingssecretmagic.whow.net'],
            },
            {
                name: 'm2pslots-103-extreme7',
                instanceType: 't3a.medium',
                domains: ['m2p-extreme7.whow.net'],
            },
            {
                name: 'm2pslots-103-wwm',
                instanceType: 't3a.small',
                domains: ['m2p-wwm.whow.net'],
            },
            {
                name: 'm2pslots-103-fireandice',
                instanceType: 't3a.small',
                domains: ['m2p-fireandice.whow.net'],
            },
            {
                name: 'm2pslots-103-luckycatch',
                instanceType: 't3a.small',
                domains: ['m2p-luckycatch.whow.net'],
            },
            {
                name: 'm2pslots-103-extremevoltage',
                instanceType: 't3a.small',
                domains: ['m2p-extremevoltage.whow.net'],
            },
            {
                name: 'm2pslots-103-monstermadness',
                instanceType: 't3a.small',
                domains: ['m2p-monstermadness.whow.net'],
            },
            {
                name: 'm2pslots-103-osiris',
                instanceType: 't3a.small',
                domains: ['m2p-osiris.whow.net'],
            },
            {
                name: 'm2pslots-103-soa2',
                instanceType: 't3a.small',
                domains: ['m2p-soa2.whow.net'],
            },
            {
                name: 'm2pslots-103-extreme7mini',
                instanceType: 't3a.small',
                domains: ['m2p-extreme7mini.whow.net'],
            },
            {
                name: 'm2pslots-103-soamax',
                instanceType: 't3a.small',
                domains: ['m2p-soamax.whow.net'],
            },
            // RETROCASINO PRODUCTION
            {
                name: 'm2pslots-104-caesarcleopatra',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-caesarcleopatra.whow.net'],
            },
            {
                name: 'm2pslots-104-extreme7',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-extreme7.whow.net'],
            },
            {
                name: 'm2pslots-104-luckycatch',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-luckycatch.whow.net'],
            },
            {
                name: 'm2pslots-104-magicmegaplay',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-magicmegaplay.whow.net'],
            },
            {
                name: 'm2pslots-104-spqr',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-spqr.whow.net'],
            },
            {
                name: 'm2pslots-104-vipclub',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-vipclub.whow.net'],
            },
            {
                name: 'm2pslots-104-wwm',
                instanceType: 't3a.micro',
                retrocasino: true,
                domains: ['m2p-wilds-wwm.whow.net'],
            },
            // STAGING
            {
                name: 'm2pslots-1103-blastingwilds',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-blastingwilds.whow.net'],
            },
            {
                name: 'm2pslots-1103-bookofbuffalo',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-bookofbuffalo.whow.net'],
            },
            {
                name: 'm2pslots-1103-caesarcleo',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-caesarcleopatra.whow.net'],
            },
            {
                name: 'm2pslots-1103-extreme7',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-extreme7.whow.net'],
            },
            {
                name: 'm2pslots-1103-luckycatch',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-luckycatch.whow.net'],
            },
            {
                name: 'm2pslots-1103-magicmegaplay',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-magicmegaplay.whow.net'],
            },
            {
                name: 'm2pslots-1103-pickapinata',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-pickapinata.whow.net'],
            },
            {
                name: 'm2pslots-1103-vipclub',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-vipclub.whow.net'],
            },
            {
                name: 'm2pslots-1103-extremevoltage',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-extremevoltage.whow.net'],
            },
            {
                name: 'm2pslots-1103-rebound',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-rebound.whow.net'],
            },
            {
                name: 'm2pslots-1103-fireandice',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-fireandice.whow.net'],
            },
            {
                name: 'm2pslots-1103-aladin',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-aladin.whow.net'],
            },
            {
                name: 'm2pslots-1103-extremefruits',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-extremefruits.whow.net'],
            },
            {
                name: 'm2pslots-1103-hotwildjokers',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-hotwildjokers.whow.net'],
            },
            {
                name: 'm2pslots-1103-soa2',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-soa2.whow.net'],
            },
            {
                name: 'm2pslots-1103-extreme7mini',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-extreme7mini.whow.net'],
            },
            {
                name: 'm2pslots-1103-soamax',
                instanceType: 't3a.micro',
                staging: true,
                domains: ['m2p-stage-soamax.whow.net'],
            },
        ];
    }
}
