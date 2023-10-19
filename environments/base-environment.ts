import { LaunchTemplateInstanceRequirements } from '@cdktf/provider-aws/lib/launch-template';
import { LbTargetGroupHealthCheck } from '@cdktf/provider-aws/lib/lb-target-group';
import { S3BackendConfig } from 'cdktf';

export interface ServiceConfig {
    name: string;
    global?: boolean;
    symbolic?: boolean;
    public?: boolean;
}

export interface BootstrapOptions {
    launchConfig?: string;
    roles?: string[];
    services?: ServiceConfig[];
}

export interface VpcSubnetConfig {
    availabilityZone: string;
    cidr: string;
}

export interface VpcConfig {
    cidr: string;
    singleNatGateway: boolean;
    publicSubnets: VpcSubnetConfig[];
    privateSubnets: VpcSubnetConfig[];
}

export interface SaltConfig {
    env: 'production' | 'acceptance';
    region: 'eu-central-1';
}

export interface Keypair {
    name: string;
    publicKey: string;
}

export interface RootDnsConfig {
    dnsName: string;
}

export interface MicroServiceConfig {
    name: string;
    instanceType: string;
    privateNodes?: number;
    publicNodes?: number;
    lbTarget?: boolean;
    lbTargetPort?: number;
    lbTargetHealthCheck?: LbTargetGroupHealthCheck;
    volumeSize?: number;
    bootstrap?: BootstrapOptions;
    additionalSecurityGroups?: string[];
    additionalTags?: { [key: string]: string };
}

export interface M2pSlotConfig {
    name: string;
    instanceType: string;
    staging?: boolean;
    retrocasino?: boolean;
    domains: string[];
}

export interface RdsConfig {
    name: string;
    instanceType: string;
    diskType: 'gp3';
    diskSize: number;
    parameterGroup?: string;
    engineVersion?: '5.7' | '8.0';
    allowDataDeptAccess?: boolean;
    proxy?: boolean;
}

export interface ElastiCacheConfig {
    type: 'memcached';
    name: string;
    instanceType: string;
    nodes: number;
}

export interface MemoryDbConfig {
    name: string;
    instanceType: string;
    shards: number;
    replicas: number;
}

export interface WebserverPoolConfig {
    name: string;
    instanceType?: string;
    instanceRequirements?: LaunchTemplateInstanceRequirements;
    diskType: 'gp3';
    diskSize: number;
    minSize: number;
    maxSize: number;
    additionalTags?: { [key: string]: string };
}

export interface AmqpConfig {
    name: string;
    instanceType: string;
    diskType: 'gp3';
    diskSize: number;
}

export interface RedisConfig {
    name: string;
    instanceType: string;
    diskType: 'gp3';
    diskSize: number;
    diskThroughput?: number;
}

export abstract class BaseEnvironment {
    public abstract get name(): string;

    public abstract get awsAccountId(): string;

    public abstract get terraformBackend(): S3BackendConfig;

    public abstract get amiDebian11(): string;

    public abstract get saltConfig(): SaltConfig;

    public abstract get vpcConfig(): VpcConfig;

    public abstract get rootDns(): RootDnsConfig;

    public abstract get rdsConfigs(): RdsConfig[];

    public abstract get elastiCacheConfigs(): ElastiCacheConfig[];

    public abstract get memoryDbConfigs(): MemoryDbConfig[];

    public abstract get redisConfigs(): RedisConfig[];

    public abstract get amqpConfigs(): AmqpConfig[];

    public abstract get microServiceConfigs(): MicroServiceConfig[];

    public abstract get webserverPools(): WebserverPoolConfig[];

    public abstract get m2pSlots(): M2pSlotConfig[];

    public abstract instanceType(instanceType: string): string;

    public abstract dbInstanceClass(instanceClass: string): string;

    public abstract elastiCacheInstanceClass(instanceClass: string): string;

    public abstract memoryDbInstanceClass(instanceClass: string): string;

    public get keypairs(): Keypair[] {
        return [
            {
                name: 'mkercmar',
                publicKey:
                    // eslint-disable-next-line max-len
                    'ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAQEAiv2URlW6kMK4vWp+uXDjSP51pGNr4piUhzBkFevCtB6tb9IfrWNfmwh4iz6VD4bops4oqo+SKBDG18EI1diHbQmW5G8DNECIscRNr2KnX0GAiKyMr/KAxJ3v1gsst/VVFD68W3WZAUUZ+GePvOL5YuAYyYFOqF0Y7Ogh3DTtBCfi+qB3nwZQO2iRFBai6YxBaPr53lTLaPpuNDB7rxbT04mweZZljWPdP5AKvsLrjgHZkO9hGi6HjQtumnhygSvtMgRNX8tLecHscU+7hyZSWroAlzowEz7074DRzaHNQK1l5hlOA1ZGhF+HZm3JP9eTlzbMdW0jPDtOHTExZIdlPQ==',
            },
        ];
    }

    public get defaultKeyName(): string {
        return 'mkercmar';
    }

    public get defaultEc2InstanceProfile(): string {
        return `${this.name}-instance-profile-ec2-default`;
    }

    public get defaultLifecycleIgnoreChanges(): string[] {
        return ['subnet_id', 'ami', 'user_data'];
    }

    public get defaultMaintenanceWindow(): string {
        return 'mon:03:00-mon:04:00';
    }

    public get defaultBackupWindow(): string {
        return '01:00-02:30';
    }

    public get defaultSpf(): string {
        return 'v=spf1 include:amazonses.com include:sendgrid.net include:_spf.google.com include:email.freshdesk.com ~all';
    }

    public get brazeClicksOrigin(): string {
        return 'eu.spgo.io';
    }

    /**
     * HINT: Max 10 Domains per Entry, current AWS defined ACM Limit of SANs per Certificate
     *
     * Adjustments needs recration of certificate, so it will be deleted first which might will fail because it is
     * used by the CloudFront distribution.
     *
     * It might be easier to create a new one, with just one domain. It will result in a new CloudFront distribution,
     * but AFAIK you only pay for traffic, not for the distribution itself
     */
    public get brazeClickDomains(): string[][] {
        return [
            [
                'clicks.7reelz.com',
                'clicks.spintales-casino.com',
                'clicks.dinocasino.games',
                'clicks.jackpot.de',
                'clicks.jackpot.at',
                'clicks.jackpot.it',
                'clicks.jackpot.pl',
                'clicks.myjackpot.co.uk',
                'clicks.mrmanchot.fr',
                'clicks.myjackpot.fr',
            ],
            [
                'clicks.myjackpot.es',
                'clicks.videoslots.casino',
                'clicks.misterjackpot.it',
                'clicks.myjackpot.com',
                'clicks.maryvegas.com',
                'clicks.lounge777.com',
                'clicks.myjackpot.se',
                'clicks.myjackpot.pt',
                'clicks.myjackpot.dk',
            ],
            [
                'clicks.veravegas.com',
                'clicks.myjackpot.hu',
                'clicks.myjackpot.ro',
                'clicks.myjackpot.com.br',
                'clicks.merkur24.com',
                'clicks.slotigo.com',
                'clicks.scatterwolf.com',
                'clicks.partners.whow.net',
            ],
            [
                'clicks.youre.casino',
            ],
            [
                'clicks.slotscraze2.com',
            ],
        ];
    }

    /**
     * HINT: Max 5 Domains per Entry, as each entry has root and www. domain SAN
     * current AWS defined ACM Limit of SANs per Certificate is 10
     */
    public get dartCasinosDomains(): string[][] {
        return [
            ['barney-slots.com', 'barneyslots.com', 'barneysslots.com', 'thepower-slots.com', 'thepowerslots.com'],
            ['snakebite-slots.com', 'snakebiteslots.com', 'knossikasino.de', 'knossicasino.de', 'knossi-kasino.de'],
            ['knossi-casino.de', 'truckercasino.de', '51casino.de', 'playboy51casino.de', 'whiteycasino.de'],
            ['venuscasino.de', 'venus-casino.de', 'philtaylorcasino.com', 'phil-taylor-casino.com', 'gamer-casino.de'],
            ['wawawulff.de', 'dr-sindsencasino.com', 'dr-sindsencasino.de', 'drsindsencasino.de'],
            ['jackpot-duo.de', 'jackpotduo.de'],
        ];
    }

    /**
     * Domains which are actually 'redirect' only to solve SEO issues of Flo Elbers
     *
     * Max 5 Domains per entry, as we have both root and www entries, and SAN per certificate is limit to 10
     *
     * Original Ticket: https://whownet.atlassian.net/browse/JP-16404
     *
     * They are running over it's own loadbalancer to not run into SSL certificate limits
     */
    public get redirectOnlyDomains(): { [key: string]: string[][] } {
        return {
            'pool-01': [
                ['banditmanchot.fr', 'jckpt.co', 'mijackpot.es', 'slottigo.com', 'vera-vegas.com'],
                ['veravegas.de', 'wera-vegas.com', 'weravegas.com', 'wild-wilma.com', 'wildewilma.com'],
                ['wildwilma.com', 'vveg.as', 'xn--jckpot-bua.de', 'myjackpot.at', 'myjackpot.it'],
                ['jackpot.com.co', 'jackpot.do', 'jackpot.gl', 'jackpot.gratis', 'jackpot.li'],
                ['jackpot.pm', 'jackpot.si', 'myjackpot.bg', 'myjackpot.com.ua', 'myjackpot.cz'],
                ['myjackpot.fi', 'myjackpot.gr', 'myjackpot.hr', 'myjackpot.ie', 'myjackpot.im'],
                ['myjackpot.info', 'myjackpot.lt', 'myjackpot.lu', 'myjackpot.lv', 'myjackpot.rs'],
                ['myjackpot.si', 'myjackpot.sk', 'jackpot.jp', 'mega-jackpots.com', 'spintales-casino.de'],
                ['monsieurmanchot.com', 'monsieurmanchot.fr', 'mrmanchot.com', 'mojackpot.pl', 'veravegas.at'],
                ['vera-vegas.at', 'veravegas.ch', 'vera-vegas.ch', 'vera-vegas.de', 'weravegas.de'],
                ['wera-vegas.de', 'veravegas.es', 'vera-vegas.es', 'veravegas.fr', 'vera-vegas.fr'],
                ['veravegas.it', 'vera-vegas.it', 'veravegas.nl', 'vera-vegas.nl', 'veravegas.pl'],
                ['vera-vegas.pl', 'maryvegas.de', 'zockenmussbocken.de', 'zockenmussbocken.tv', 'zockenmussbocken.at'],
                ['slotigo.de', 'slotygo.de', 'slottigo.de', 'slotiego.de', 'slotiego.com'],
                ['slotigo.fr', 'slotigo.pl', 'scatterwulf.com', 'lounge777.de', '7reelz.de'],
                ['spintales-casino.com'],
            ],
            'pool-02': [
                ['epic-wilds-casino.com', 'epic-wilds-casino.net', 'epic-wilds.com', 'epic-wilds.net', 'epicwilds.net'],
                ['epicwildscasino.com', 'epicwildscasino.net', 'epic-wilds-casino.de', 'epic-wilds.de', 'epicwilds.de'],
                ['epicwildscasino.de', 'whow.com', 'whowgames.net', 'whow-games.de', 'whowgames.de'],
                ['whow-games.com', 'whowgames.com'],
            ],
        };
    }
}
