import { App, S3Backend, TerraformStack } from 'cdktf';

import { Acceptance } from './environments/acceptance';
import { AcmClicksSubdomainsStack } from './acm/acm-clicks-subdomains.stack';
import { AcmDartcasinosStack } from './acm/acm-dartcasinos.stack';
import { AcmJackpotDomainsStack } from './acm/acm-jackpot-domains.stack';
import { AcmJackpotMiscStack } from './acm/acm-jackpot-misc.stack';
import { AcmJackpotWhitelabelsStack } from './acm/acm-jackpot-whitelabels.stack';
import { AcmRedirectsStack } from './acm/acm-redirects.stack';
import { AcmSpielbrauseStack } from './acm/acm-spielbrause.stack';
import { AcmTigerkingStack } from './acm/acm-tigerking.stack';
import { AmqpStack } from './stacks/infrastructure/amqp.stack';
import { AptStack } from './stacks/infrastructure/apt.stack';
import { AuthStack } from './stacks/infrastructure/auth.stack';
import { BaseEnvironment } from './environments/base-environment';
import { CertbotStack } from './stacks/infrastructure/certbot.stack';
import { CloudfrontBrazeClicksStack } from './cloudfront/cloudfront-braze-clicks.stack';
import { Construct } from 'constructs';
import { CronServerStack } from './stacks/product/cron-server.stack';
import { DataAwsEip } from '@cdktf/provider-aws/lib/data-aws-eip';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';
import { DataAwsSecurityGroup } from '@cdktf/provider-aws/lib/data-aws-security-group';
import { DataAwsSubnets } from '@cdktf/provider-aws/lib/data-aws-subnets';
import { DataAwsVpc } from '@cdktf/provider-aws/lib/data-aws-vpc';
import { DbadminStack } from './stacks/infrastructure/dbadmin.stack';
import { DebuildBullseyeStack } from './stacks/infrastructure/debuild-bullseye.stack';
import { DevproxyStack } from './stacks/infrastructure/devproxy.stack';
import { DnsDartcasinosStack } from './dns/dns-dartcasinos.stack';
import { DnsDomain7ReelzCom } from './dns/domains/domain-7reelz.com';
import { DnsDomainDinocasinoGames } from './dns/domains/domain-dinocasino.games';
import { DnsDomainJackpotAt } from './dns/domains/domain-jackpot.at';
import { DnsDomainJackpotDe } from './dns/domains/domain-jackpot.de';
import { DnsDomainJackpotIt } from './dns/domains/domain-jackpot.it';
import { DnsDomainJackpotPl } from './dns/domains/domain-jackpot.pl';
import { DnsDomainJckptCo } from './dns/domains/domain-jckpt.co';
import { DnsDomainLeovegasplayIt } from './dns/domains/domain-leovegasplay.it';
import { DnsDomainLounge777Com } from './dns/domains/domain-lounge777.com';
import { DnsDomainMaryvegasCom } from './dns/domains/domain-maryvegas.com';
import { DnsDomainMerkur24Com } from './dns/domains/domain-merkur24.com';
import { DnsDomainMisterjackpotIt } from './dns/domains/domain-misterjackpot.it';
import { DnsDomainMojackpotPl } from './dns/domains/domain-mojackpot.pl';
import { DnsDomainMojjackpotPl } from './dns/domains/domain-mojjackpot.pl';
import { DnsDomainMrmanchotFr } from './dns/domains/domain-mrmanchot.fr';
import { DnsDomainMyJackpotCom } from './dns/domains/domain-myjackpot.com';
import { DnsDomainMyjackpotCoUk } from './dns/domains/domain-myjackpot.co.uk';
import { DnsDomainMyjackpotComBr } from './dns/domains/domain-myjackpot.com.br';
import { DnsDomainMyjackpotDk } from './dns/domains/domain-myjackpot.dk';
import { DnsDomainMyjackpotEs } from './dns/domains/domain-myjackpot.es';
import { DnsDomainMyjackpotFr } from './dns/domains/domain-myjackpot.fr';
import { DnsDomainMyjackpotHu } from './dns/domains/domain-myjackpot.hu';
import { DnsDomainMyjackpotPt } from './dns/domains/domain-myjackpot.pt';
import { DnsDomainMyjackpotRo } from './dns/domains/domain-myjackpot.ro';
import { DnsDomainMyjackpotRu } from './dns/domains/domain-myjackpot.ru';
import { DnsDomainMyjackpotSe } from './dns/domains/domain-myjackpot.se';
import { DnsDomainScatterwolfCom } from './dns/domains/domain-scatterwolf.com';
import { DnsDomainSlotigoCom } from './dns/domains/domain-slotigo.com';
import { DnsDomainSlotsCraze2Com } from './dns/domains/domain-slotscraze2.com';
import { DnsDomainSpielbrauseNet } from './dns/domains/domain-spielbrause.net';
import { DnsDomainSpintalesCasinoCom } from './dns/domains/domain-spintales-casino.com';
import { DnsDomainSpintalesSlotsCom } from './dns/domains/domain-spintales-slots.com';
import { DnsDomainTigerkingDe } from './dns/domains/domain-tigerking.de';
import { DnsDomainVeraVegasCom } from './dns/domains/domain-veravegas.com';
import { DnsDomainVideoslotsCasino } from './dns/domains/domain-videoslots.casino';
import { DnsDomainVvegAs } from './dns/domains/domain-vveg.as';
import { DnsDomainWhowCom } from './dns/domains/domain-whow.com';
import { DnsDomainWhowNet } from './dns/domains/domain-whow.net';
import { DnsDomainWhowgamesNet } from './dns/domains/domain-whowgames.net';
import { DnsDomainYoureCasino } from './dns/domains/domain-youre.casino';
import { DnsMiscLbSuiteStack } from './dns/dns-misc-lb-suite.stack';
import { DnsRetrocasinoStack } from './dns/dns-retrocasino.stack';
import { DnsSuiteRedirectsStack } from './dns/dns-suite-redirects.stack';
import { DnsWhowgamesRedirectsStack } from './dns/dns-whowgames-redirects.stack';
import { ElastiCacheBaseStack } from './stacks/elasti-cache/elasti-cache-base.stack';
import { ElastiCacheMemcachedClusterStack } from './stacks/elasti-cache/elasti-cache-memcached.stack';
import { FluentdStack } from './stacks/infrastructure/fluentd.stack';
import { GitlabRunnerStack } from './stacks/infrastructure/gitlab-runner.stack';
import { GrafanaStack } from './stacks/infrastructure/grafana.stack';
import { IamStack } from './stacks/base/iam.stack';
import { JenkinsStack } from './stacks/infrastructure/jenkins.stack';
import { JumphostStack } from './stacks/infrastructure/jumphost.stack';
import { JusyncStack } from './stacks/infrastructure/jusync.stack';
import { KeypairStack } from './stacks/base/keypair.stack';
import { LegacySslStack } from './stacks/infrastructure/legacy-ssl.stack';
import { LoadStack } from './stacks/infrastructure/load.stack';
import { LoadbalancerRedirectsStack } from './stacks/loadbalancer/loadbalancer-redirects.stack';
import { LoadbalancerRetrocasinoStack } from './stacks/loadbalancer/loadbalancer-retrocasino.stack';
import { LoadbalancerServicesStack } from './stacks/loadbalancer/loadbalancer-services.stack';
import { LoadbalancerStagingStack } from './stacks/loadbalancer/loadbalancer-staging.stack';
import { LoadbalancerSuiteStack } from './stacks/loadbalancer/loadbalancer-suite.stack';
import { LogstashStack } from './stacks/infrastructure/logstash.stack';
import { M2pBaseStack } from './stacks/m2p/m2p-base.stack';
import { M2pLoadbalancerProductionStack } from './stacks/m2p/m2p-loadbalancer-production.stack';
import { M2pLoadbalancerRetrocasinoStack } from './stacks/m2p/m2p-loadbalancer-retrocasino.stack';
import { M2pLoadbalancerStagingStack } from './stacks/m2p/m2p-loadbalancer-staging.stack';
import { M2pSlotStack } from './stacks/m2p/m2p-slot.stack';
import { MicroServiceStack } from './stacks/product/micro-service.stack';
import { MongoM2pSlotsStack } from './stacks/mongo/mongo-m2pslots.stack';
import { MongoOfferaiStack } from './stacks/mongo/mongo-offerai.stack';
import { MongoRetrocasinoStack } from './stacks/mongo/mongo-restrocasino.stack';
import { MongoStagingStack } from './stacks/mongo/mongo-staging.stack';
import { MongoSuiteConfigStack } from './stacks/mongo/mongo-suite-config.stack';
import { MongoSuiteMongosStack } from './stacks/mongo/mongo-suite-mongos.stack';
import { MongoSuiteRs0Stack } from './stacks/mongo/mongo-suite-rs0.stack';
import { OpenvpnNagiosStack } from './stacks/infrastructure/openvpn-nagios.stack';
import { OpenvpnUsersStack } from './stacks/infrastructure/openvpn-users.stack';
import { Production } from './environments/production';
import { ProviderStack } from './stacks/base/provider.stack';
import { RdsBaseStack } from './stacks/rds/rds-base.stack';
import { RdsInstanceStack } from './stacks/rds/rds-instance.stack';
import { RedisInstanceStack } from './stacks/redis/redis-instance.stack';
import { RedisM2pslotsStack } from './stacks/redis/redis-m2pslots.stack';
import { RedisRetrocasinoStack } from './stacks/redis/redis-retrocasino.stack';
import { RedisStagingStack } from './stacks/redis/redis-staging.stack';
import { RemoteBackendStack } from './stacks/base/remote-backend.stack';
import { RootDnsStack } from './stacks/base/root-dns.stack';
import { S3ServerBackupStack } from './stacks/base/s3-server-backup';
import { SaltStack } from './stacks/infrastructure/salt.stack';
import { SecurityGroupsStack } from './stacks/base/security-groups.stack';
import { SecurityStack } from './stacks/base/security.stack';
import { SrvdbStack } from './stacks/infrastructure/srvdb.stack';
import { SslCertificatesStack } from './stacks/base/ssl-certificates.stack';
import { SuiteMqProcessStack } from './stacks/product/suite-mqprocess.stack';
import { TestInstanceStack } from './stacks/test-instance.stack';
import { VpcStack } from './stacks/base/vpc.stack';
import { WebserverPoolStack } from './stacks/product/webserver-pool.stack';
import { XhprofStack } from './stacks/infrastructure/xhprof.stack';
import { Route53DelegationSet } from '@cdktf/provider-aws/lib/route53-delegation-set';
import { RdsProxyInstanceStack } from './stacks/rds/rds-proxy-instance.stack';

let env: BaseEnvironment;

switch (process.env.TF_ENV) {
    case 'acceptance':
        env = new Acceptance();

        break;
    case 'production':
        env = new Production();

        break;
    default:
        throw new Error('invalid environment');
}

class WhowStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new S3Backend(this, env.terraformBackend);

        // base
        const providers = new ProviderStack(this, 'provider-stack', env);

        new SecurityStack(this, 'security-stack');

        new RemoteBackendStack(this, 'remote-backend-stack', env);

        const vpc = new VpcStack(this, 'vpc-stack', env);

        const securityGroups = new SecurityGroupsStack(this, 'security-groups-stack', env, vpc.vpcId);

        const dns = new RootDnsStack(this, 'root-dns', env);

        new KeypairStack(this, 'keypair-stack', env);

        const s3ServerBackup = new S3ServerBackupStack(this, `s3-server-backup-stack`, env);

        const iamStack = new IamStack(this, `iam-stack`, env, s3ServerBackup);

        const sslCertificates = new SslCertificatesStack(this, `ssl-certificates-stack`, env, providers);

        // infrastructure
        new JumphostStack(this, 'jumphost-stack', env, vpc, dns.zoneId, securityGroups);
        new SaltStack(this, 'salt-stack', env, vpc, dns.zoneId);
        new AptStack(this, 'apt-stack', env, vpc, dns.zoneId);
        new JusyncStack(this, `jusync-stack`, env, vpc);
        new SrvdbStack(this, 'srvdb-stack', env, vpc);
        new CertbotStack(this, 'certbot-stack', env, vpc);
        const grafanaStack = new GrafanaStack(this, 'grafana-stack', env, vpc);
        new LogstashStack(this, 'logstash-stack', env, vpc);
        new FluentdStack(this, 'fluentd-stack', env, vpc);
        new LoadStack(this, 'load-stack', env, vpc);
        new XhprofStack(this, 'xhprof-stack', env, vpc);

        new OpenvpnNagiosStack(this, 'openvpn-nagios-stack', env, vpc, securityGroups);
        new OpenvpnUsersStack(this, 'openvpn-user-stack', env, vpc, securityGroups);

        const auth = new AuthStack(this, 'auth-stack', env, vpc);

        new DbadminStack(this, 'dbadmin-stack', env, vpc);

        new DevproxyStack(this, 'devproxy-stack', env, vpc, securityGroups);
        new JenkinsStack(this, 'jenkins-stack', env, vpc);
        new GitlabRunnerStack(this, 'gitlab-runner-stack', env, vpc);

        new DebuildBullseyeStack(this, 'debuild-bullseye-stack', env, vpc);

        new LegacySslStack(this, 'legacy-ssl-stack', env, vpc, securityGroups);

        // rds
        const rdsBaseStack = new RdsBaseStack(this, `rds-base-stack`, env, vpc);

        const rdsInstancesWithProxy = [];
        for (const rdsConfig of env.rdsConfigs) {
            const stack = new RdsInstanceStack(this, `rds-${rdsConfig.name}`, env, rdsConfig, rdsBaseStack, securityGroups);
            if(stack.createProxy){
                rdsInstancesWithProxy.push(stack.dbInstance);
            }
        }

        for (const dbInstance of rdsInstancesWithProxy) {
            new RdsProxyInstanceStack(this,`rds-proxy-${dbInstance.id}`, vpc, rdsBaseStack, dbInstance, iamStack.rdsProxyRole);
        }

        // elasticache
        const elastiCacheBaseStack = new ElastiCacheBaseStack(this, `elasticache-base-stack`, env, vpc);

        for (const elastiCacheConfig of env.elastiCacheConfigs) {
            switch (elastiCacheConfig.type) {
                case 'memcached':
                    new ElastiCacheMemcachedClusterStack(
                        this,
                        `elasticache-${elastiCacheConfig.name}`,
                        env,
                        elastiCacheConfig,
                        elastiCacheBaseStack,
                    );

                    break;
                default:
                    throw new Error('Invaldi elastiCache type');
            }
        }

        // memorydb
        //const memoryDbBaseStack = new MemoryDbBaseStack(this, `memorydb-base-stack`, env, vpc);

        /*
        for (const memoryDbConfig of env.memoryDbConfigs) {
            new MemoryDbClusterStack(this, `memorydb-${memoryDbConfig.name}-stack`, env, memoryDbConfig, memoryDbBaseStack, securityGroups);
        }
        */

        // mongo
        new MongoSuiteRs0Stack(this, `mongo-suite-rs0-stack`, env, vpc);
        new MongoSuiteConfigStack(this, `mongo-suite-config-stack`, env, vpc);
        new MongoSuiteMongosStack(this, `mongo-suite-mongos-stack`, env, vpc, securityGroups);
        new MongoStagingStack(this, `mongo-staging-stack`, env, vpc);
        new MongoM2pSlotsStack(this, `mongo-m2pslots-stack`, env, vpc);
        new MongoRetrocasinoStack(this, 'mongo-retrocasino-stack', env, vpc, securityGroups);
        new MongoOfferaiStack(this, 'mongo-offerai-stack', env, vpc);

        // redis
        new RedisRetrocasinoStack(this, 'redis-retrocasino-stack', env, vpc);
        new RedisM2pslotsStack(this, 'redis-m2pslots-stack', env, vpc);
        new RedisStagingStack(this, 'redis-staging-stack', env, vpc);

        for (const redisConfig of env.redisConfigs) {
            new RedisInstanceStack(this, `redis-${redisConfig.name}-stack`, env, redisConfig, vpc);
        }

        // product
        new CronServerStack(this, `cron-server-stack`, env, vpc);
        new SuiteMqProcessStack(this, `suite-mqprocess-stack`, env, vpc);

        // amqp
        for (const amqpConfig of env.amqpConfigs) {
            new AmqpStack(this, `amqp-${amqpConfig.name}-stack`, env, amqpConfig, vpc, securityGroups);
        }

        // microservices
        const microServices = new Map<string, MicroServiceStack>();

        for (const microServiceConfig of env.microServiceConfigs) {
            microServices.set(
                microServiceConfig.name,
                new MicroServiceStack(this, `ms-${microServiceConfig.name}-stack`, env, microServiceConfig, vpc, securityGroups),
            );
        }

        // webserver pools
        const webserverPools = new Map<string, WebserverPoolStack>();

        for (const webserverPoolConfig of env.webserverPools) {
            webserverPools.set(
                webserverPoolConfig.name,
                new WebserverPoolStack(this, `webserver-pool-${webserverPoolConfig.name}`, env, webserverPoolConfig, vpc),
            );
        }

        // loadbalancer
        new LoadbalancerStagingStack(
            this,
            `loadbalancer-staging-stack`,
            vpc,
            securityGroups,
            sslCertificates,
            webserverPools,
            microServices,
        );

        new LoadbalancerSuiteStack(this, `loadbalancer-suite-stack`, vpc, securityGroups, sslCertificates, webserverPools, microServices);

        new LoadbalancerServicesStack(
            this,
            `loadbalancer-services-stack`,
            vpc,
            securityGroups,
            sslCertificates,
            webserverPools,
            auth,
            grafanaStack,
            microServices,
        );

        new LoadbalancerRetrocasinoStack(this, 'loadbalancer-retrocasino-stack', vpc, securityGroups, sslCertificates, webserverPools);

        new LoadbalancerRedirectsStack(this, 'loadbalancer-redirects-stack', env, vpc, securityGroups, sslCertificates, webserverPools);

        // temporary import instance
        new TestInstanceStack(this, 'temporary-mysql-import-instance-stack', env, vpc, { name: 'tmp-mysql-import', diskSize: 500 });
    }
}

class M2pStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new S3Backend(this, { ...env.terraformBackend, key: `m2p-${env.terraformBackend.key}` });

        // base
        const providers = new ProviderStack(this, 'provider-stack', env);

        const sslCertificates = new SslCertificatesStack(this, `ssl-certificates-stack`, env, providers);

        // fetch require data
        const vpc = new DataAwsVpc(this, 'data-vpc', { tags: { Name: `${env.name}-vpc` } });

        const privateSubnets = new DataAwsSubnets(this, 'data-subnets-private', {
            filter: [
                {
                    name: 'vpc-id',
                    values: [vpc.id],
                },
            ],
            tags: {
                Tier: 'Private',
            },
        });

        const publicSubnets = new DataAwsSubnets(this, 'data-subnets-public', {
            filter: [
                {
                    name: 'vpc-id',
                    values: [vpc.id],
                },
            ],
            tags: {
                Tier: 'Public',
            },
        });

        const securityGroups = new Map<string, DataAwsSecurityGroup>();

        for (const name of ['default', 'sg-http', 'sg-https']) {
            securityGroups.set(
                name,
                new DataAwsSecurityGroup(this, `data-security-${name}`, {
                    tags: {
                        Name: `${env.name}-${name}`,
                    },
                }),
            );
        }

        // m2p base
        const m2pBase = new M2pBaseStack(this, `m2p-base-stack`, env, { vpc, privateSubnets });

        // m2p slots
        const m2pSlots = new Map<string, M2pSlotStack>();

        for (const m2pSlot of env.m2pSlots) {
            m2pSlots.set(m2pSlot.name, new M2pSlotStack(this, `${m2pSlot.name}-stack`, env, m2pSlot, { vpc, privateSubnets }));
        }

        // loadbalancer
        new M2pLoadbalancerStagingStack(this, 'm2p-loadbalanacer-staging', sslCertificates, m2pBase, env.m2pSlots, m2pSlots, {
            vpc,
            privateSubnets,
            publicSubnets,
            securityGroups,
        });

        new M2pLoadbalancerRetrocasinoStack(this, 'm2p-loadbalancer-retrocasino', sslCertificates, m2pBase, env.m2pSlots, m2pSlots, {
            vpc,
            privateSubnets,
            publicSubnets,
            securityGroups,
        });

        new M2pLoadbalancerProductionStack(this, 'm2p-loadbalancer-production', sslCertificates, m2pBase, env.m2pSlots, m2pSlots, {
            vpc,
            privateSubnets,
            publicSubnets,
            securityGroups,
        });
    }
}

class DnsStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new S3Backend(this, { ...env.terraformBackend, key: `dns-${env.terraformBackend.key}` });

        const delegationSet = new Route53DelegationSet(this, 'whitelabel-name-servers', {
            referenceName: 'whow-infrastructure'
        });


        // base
        new ProviderStack(this, 'provider-stack', env);

        // data
        const dataLoadBalancerSuite = new DataAwsLb(this, 'data-lb-suite', { name: 'elb-suite' });
        const dataLoadBalancerServices = new DataAwsLb(this, 'data-lb-services', { name: 'elb-services' });
        const dataLoadBalancerRetrocasino = new DataAwsLb(this, 'data-lb-retrocasino', { name: 'elb-retrocasino' });
        const dataLoadBalancerStaging = new DataAwsLb(this, 'data-lb-staging', { name: 'elb-staging' });

        const dataLoadBalancerM2pProduction = new DataAwsLb(this, 'data-lb-m2pslots-103', { name: 'elb-m2pslots-103' });
        const dataLoadBalancerM2pRetrocasino = new DataAwsLb(this, 'data-lb-m2pslots-104', { name: 'elb-m2pslots-104' });
        const dataLoadBalancerM2pStaging = new DataAwsLb(this, 'data-lb-m2pslots-staging', { name: 'elb-m2pslots-staging' });

        const dataElasticIpLegacySsl = new DataAwsEip(this, 'data-elasticip-legacy-ssl', { tags: { Name: `${env.name}-legacy-ssl` } });

        // "scripted" zones..
        new DnsDartcasinosStack(this, 'dns-dartcasinos-stack', env, dataLoadBalancerServices);
        new DnsRetrocasinoStack(this, 'dns-retrocasino-stack', env, dataLoadBalancerRetrocasino);
        new DnsMiscLbSuiteStack(this, 'dns-misc-lb-suite-stack', env, dataLoadBalancerSuite);
        new DnsSuiteRedirectsStack(this, 'dns-suite-redirects-stack', env, dataLoadBalancerSuite);
        new DnsWhowgamesRedirectsStack(this, 'dns-whowgames-redirects-stack', env, dataLoadBalancerServices);

        // static zones..
        new DnsDomainMojackpotPl(this, 'dns-domain-mojackpot.pl', env, dataLoadBalancerSuite);
        new DnsDomainMojjackpotPl(this, 'dns-domain-mojjackpot.pl', env, dataLoadBalancerSuite);
        new DnsDomainSpintalesSlotsCom(this, 'dns-domain-spintales-slots.com', env, dataLoadBalancerSuite);
        new DnsDomainWhowgamesNet(this, 'dns-domain-whowgames.net', env, dataLoadBalancerServices);
        new DnsDomainDinocasinoGames(this, 'dns-domain-dinocasino.games', env, dataLoadBalancerSuite);
        new DnsDomain7ReelzCom(this, 'dns-domain-7reelz.com', env, dataLoadBalancerSuite);
        new DnsDomainSpintalesCasinoCom(this, 'dns-domain-spintales-casino.com', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotSe(this, 'dns-domain-myjackpot.se', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotRo(this, 'dns-domain-myjackpot.ro', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotPt(this, 'dns-domain-myjackpot.pt', env, dataLoadBalancerSuite);
        new DnsDomainMisterjackpotIt(this, 'dns-domain-misterjackpot.it', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotHu(this, 'dns-domain-myjackpot.hu', env, dataLoadBalancerSuite);
        new DnsDomainMrmanchotFr(this, 'dns-domain-mrmanchot.fr', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotDk(this, 'dns-domain-myjackpot.dk', env, dataLoadBalancerSuite);
        new DnsDomainSlotigoCom(this, 'dns-domain-slotigo.com', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotCoUk(this, 'dns-domain-myjackpot.co.uk', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotRu(this, 'dns-domain-myjackpot.ru', env, dataLoadBalancerSuite);
        new DnsDomainJackpotPl(this, 'dns-domain-jackpot.pl', env, dataLoadBalancerSuite);
        new DnsDomainJackpotIt(this, 'dns-domain-jackpot.it', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotEs(this, 'dns-domain-myjackpot.es', env, dataLoadBalancerSuite);
        new DnsDomainWhowCom(this, 'dns-domain-whow.com', env, dataLoadBalancerSuite, dataLoadBalancerServices);
        new DnsDomainMaryvegasCom(this, 'dns-domain-maryvegas.com', env, dataLoadBalancerSuite);
        new DnsDomainLounge777Com(this, 'dns-domain-lounge777.com', env, dataLoadBalancerSuite);
        new DnsDomainVideoslotsCasino(this, 'dns-domain-videoslots.casino', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotComBr(this, 'dns-comain-myjackpot.com.br', env, dataLoadBalancerSuite);
        new DnsDomainJackpotAt(this, 'dns-domain-jackpot.at', env, dataLoadBalancerSuite);
        new DnsDomainLeovegasplayIt(this, 'dns-domain-leovegasplay.it', env, dataLoadBalancerSuite);
        new DnsDomainMerkur24Com(this, 'dns-domain-merkur24.com', env, dataLoadBalancerSuite);
        new DnsDomainMyjackpotFr(this, 'dns-domain-myjackpot.fr', env, dataLoadBalancerSuite, dataElasticIpLegacySsl);
        new DnsDomainVeraVegasCom(this, 'dns-domain-veravegas.com', env, dataLoadBalancerSuite, dataElasticIpLegacySsl);
        new DnsDomainMyJackpotCom(this, 'dns-domain-myjackpot.com', env, dataLoadBalancerSuite, dataElasticIpLegacySsl);
        new DnsDomainSpielbrauseNet(this, 'dns-domain-spielbrause.net', env, dataLoadBalancerSuite);
        new DnsDomainScatterwolfCom(this, 'dns-domain-scatterwolf.com', env, dataLoadBalancerSuite);
        new DnsDomainYoureCasino(this, 'dns-domain-youre.casino', env, dataLoadBalancerSuite);
        new DnsDomainTigerkingDe(this, 'dns-domain-tigerking.de', env, dataLoadBalancerServices, dataLoadBalancerStaging);
        new DnsDomainJckptCo(this, 'dns-domain-jckpt.co', env, dataLoadBalancerSuite);
        new DnsDomainVvegAs(this, 'dns-domain-vveg.as', env, dataLoadBalancerSuite);
        new DnsDomainSlotsCraze2Com(this, 'dns-domain-slotscraze2.com', env, dataLoadBalancerSuite, delegationSet.id);

        new DnsDomainJackpotDe(
            this,
            'dns-domain-jackpot.de',
            env,
            dataLoadBalancerSuite,
            dataLoadBalancerServices,
            dataLoadBalancerStaging,
            dataElasticIpLegacySsl,
        );

        new DnsDomainWhowNet(
            this,
            'dns-domain-whow.net',
            env,
            dataLoadBalancerSuite,
            dataLoadBalancerServices,
            dataLoadBalancerRetrocasino,
            dataLoadBalancerStaging,
            dataLoadBalancerM2pProduction,
            dataLoadBalancerM2pRetrocasino,
            dataLoadBalancerM2pStaging,
        );
    }
}

class AcmStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new S3Backend(this, { ...env.terraformBackend, key: `acm-${env.terraformBackend.key}` });

        // base
        const providers = new ProviderStack(this, 'provider-stack', env);

        // data
        const dataRoute53Zones = new Map<string, DataAwsRoute53Zone>();

        let domains = [
            '7reelz.com',
            'dinocasino.games',
            'jackpot.at',
            'jackpot.de',
            'jackpot.it',
            'jackpot.pl',
            'leovegasplay.it',
            'lounge777.com',
            'maryvegas.com',
            'merkur24.com',
            'misterjackpot.it',
            'mojjackpot.pl',
            'mrmanchot.fr',
            'myjackpot.co.uk',
            'myjackpot.com.br',
            'myjackpot.com',
            'myjackpot.dk',
            'myjackpot.es',
            'myjackpot.fr',
            'myjackpot.hu',
            'myjackpot.pt',
            'myjackpot.ro',
            'myjackpot.se',
            'scatterwolf.com',
            'slotigo.com',
            'spintales-casino.com',
            'spintales-slots.com',
            'veravegas.com',
            'videoslots.casino',
            'whow.net',
            'spielbrause.net',
            'tigerking.de',
            'youre.casino',
            'slotscraze2.com',
        ];

        for (let i = 0; i < env.dartCasinosDomains.length; i++) {
            for (const domain of env.dartCasinosDomains[i]) {
                domains.push(domain);
            }
        }

        for (const elm of Object.values(env.redirectOnlyDomains)) {
            for (let i = 0; i < elm.length; i++) {
                for (const domain of elm[i]) {
                    domains.push(domain);
                }
            }
        }

        // make unique
        domains = [...new Set(domains)];

        for (const domain of domains) {
            dataRoute53Zones.set(domain, new DataAwsRoute53Zone(this, `data-aws-zone-${domain}`, { name: domain }));
        }

        // ACM
        new AcmDartcasinosStack(this, 'acm-dartcasinos-stack', env, dataRoute53Zones);
        new AcmJackpotDomainsStack(this, 'acm-jackpot-domains-stack', env, dataRoute53Zones);
        new AcmJackpotWhitelabelsStack(this, 'acm-jackpot-whitelabels-stack', env, dataRoute53Zones);
        new AcmJackpotMiscStack(this, 'acm-jackpot-misc-stack', env, dataRoute53Zones);
        new AcmClicksSubdomainsStack(this, 'acm-clicks-subdomains-stack', env, dataRoute53Zones, providers);
        new AcmSpielbrauseStack(this, 'acm-spielbrause-stack', env, dataRoute53Zones);
        new AcmTigerkingStack(this, 'acm-tigerking-stack', env, dataRoute53Zones);
        new AcmRedirectsStack(this, 'acm-redirects-stack', env, dataRoute53Zones);
    }
}

class CloudfrontStack extends TerraformStack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        new S3Backend(this, { ...env.terraformBackend, key: `cloudfront-${env.terraformBackend.key}` });

        // base
        const providers = new ProviderStack(this, 'provider-stack', env);

        const sslCertificates = new SslCertificatesStack(this, `ssl-certificates-stack`, env, providers);

        // data
        const dataRoute53Zones = new Map<string, DataAwsRoute53Zone>();

        const domains = [
            '7reelz.com',
            'dinocasino.games',
            'jackpot.at',
            'jackpot.de',
            'jackpot.it',
            'jackpot.pl',
            'leovegasplay.it',
            'lounge777.com',
            'maryvegas.com',
            'merkur24.com',
            'misterjackpot.it',
            'mojjackpot.pl',
            'mrmanchot.fr',
            'myjackpot.co.uk',
            'myjackpot.com.br',
            'myjackpot.com',
            'myjackpot.dk',
            'myjackpot.es',
            'myjackpot.fr',
            'myjackpot.hu',
            'myjackpot.pt',
            'myjackpot.ro',
            'myjackpot.se',
            'scatterwolf.com',
            'slotigo.com',
            'spintales-casino.com',
            'spintales-slots.com',
            'veravegas.com',
            'videoslots.casino',
            'whow.net',
            'spielbrause.net',
            'youre.casino',
            'slotscraze2.com',
        ];

        for (const domain of domains) {
            dataRoute53Zones.set(domain, new DataAwsRoute53Zone(this, `data-aws-zone-${domain}`, { name: domain }));
        }

        // cloudfront
        new CloudfrontBrazeClicksStack(this, `cloudfront-braze-clicks-stack`, env, sslCertificates, dataRoute53Zones);
    }
}

const app = new App();

new WhowStack(app, 'whow');
new M2pStack(app, 'm2p');
new DnsStack(app, 'dns');
new AcmStack(app, 'acm');
new CloudfrontStack(app, 'cloudfront');

app.synth();
