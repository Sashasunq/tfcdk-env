import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsEip } from '@cdktf/provider-aws/lib/data-aws-eip';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainWhowNet extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        loadbalancerSuite: DataAwsLb,
        loadbalancerServices: DataAwsLb,
        loadbalancerRetrocasino: DataAwsLb,
        loadbalancerStaging: DataAwsLb,
        loadbalancerM2pProduction: DataAwsLb,
        loadbalancerM2pRetrocasino: DataAwsLb,
        loadbalancerM2pStaging: DataAwsLb,
    ) {
        super(scope, id);

        const domain = 'whow.net';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        // whow.net - company website
        new Route53Record(this, `record-${domain}-root`, {
            zoneId: zone.id,
            name: domain,
            type: 'A',
            alias: {
                name: loadbalancerServices.dnsName,
                zoneId: loadbalancerServices.zoneId,
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-www`, {
            zoneId: zone.id,
            name: 'www',
            type: 'A',
            alias: {
                name: loadbalancerServices.dnsName,
                zoneId: loadbalancerServices.zoneId,
                evaluateTargetHealth: false,
            },
        });
        /**/

        // mx & other base stuff
        new Route53Record(this, `record-${domain}-mx`, {
            zoneId: zone.id,
            name: domain,
            type: 'MX',
            ttl: 300,
            records: [
                '1 aspmx.l.google.com.',
                '5 alt1.aspmx.l.google.com.',
                '5 alt2.aspmx.l.google.com.',
                '10 aspmx2.googlemail.com.',
                '10 aspmx3.googlemail.com.',
            ],
        });

        new Route53Record(this, `record-${domain}-txt`, {
            zoneId: zone.id,
            name: domain,
            type: 'TXT',
            ttl: 300,
            records: [env.defaultSpf, 'apple-domain-verification=RrvayRdRCOoyycw6'],
        });

        new Route53Record(this, `record-${domain}-google-domainkey`, {
            zoneId: zone.id,
            name: 'google._domainkey',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArF5N6gEW96tIMy2dZ4VWtChfsUDvXdWiJY+0py90as1io+/mRhnYC7JEa8eIJ/kTpy09vQSLD8fGLV61yuBCayCKXQQ3Nwehk6zdIbpIKW1eb+QmUI+1owgaazVTZu0tfnc4HDF7NodImf13wPjUArhXBJ3n2u1hti6jLZBGpqN8HwflkFgLZPFs6u3SyXxV""FoyTYkT9ypS22ijmhPo1O9Pi7Y9nfKhK4jPy7PgtEff4mH2ormzhg5+5F86zdKX4hLsNW2K8HvGSo+WWm6l5Xnmg2ZXKSzQCVmo2m/vAbnRZ4cV6aRFiJiiAHGlbDhji3KztrmzgW+/BTK43H+fBwwIDAQAB',
            ],
        });

        // TODO: SES still on old account
        new Route53Record(this, `record-${domain}-ses-txt`, {
            zoneId: zone.id,
            name: '_amazonses',
            type: 'TXT',
            ttl: 1800,
            records: ['0CJtZ1ngNMFkgDDcWR0wD3AnBaWAWXGQC3dSMzrBWcI=', '+1M4Q9me46MQVDrYs8WzyNPgpaEQj3A1SlkC2DPi5uQ='],
        });

        new Route53Record(this, `record-${domain}-ses-domainkey-1`, {
            zoneId: zone.id,
            name: 'cyqu2t6wznq7tpvyyhxavwzprawazleb._domainkey',
            type: 'CNAME',
            ttl: 1800,
            records: ['cyqu2t6wznq7tpvyyhxavwzprawazleb.dkim.amazonses.com.'],
        });

        new Route53Record(this, `record-${domain}-ses-domainkey-2`, {
            zoneId: zone.id,
            name: 'iklkd5truph4wrbjod5r5surejef5mjz._domainkey',
            type: 'CNAME',
            ttl: 1800,
            records: ['iklkd5truph4wrbjod5r5surejef5mjz.dkim.amazonses.com.'],
        });

        new Route53Record(this, `record-${domain}-ses-domainkey-3`, {
            zoneId: zone.id,
            name: 'rqvygybzyl75scev7ugicm5inpvectwn._domainkey',
            type: 'CNAME',
            ttl: 1800,
            records: ['rqvygybzyl75scev7ugicm5inpvectwn.dkim.amazonses.com.'],
        });

        new Route53Record(this, `record-${domain}-ses-sbim`, {
            zoneId: zone.id,
            name: '_amazonses.sbsim',
            type: 'TXT',
            ttl: 1800,
            records: ['fsfOSJYaGrecYzrzRBN2GCYuWRpVZ8IeWKT4bf5PNCk='],
        });

        // sendgrid
        new Route53Record(this, `record-${domain}-sendgrid-s1`, {
            zoneId: zone.id,
            name: 's1._domainkey',
            type: 'CNAME',
            ttl: 300,
            records: ['s1.domainkey.u2320378.wl129.sendgrid.net.'],
        });

        new Route53Record(this, `record-${domain}-sendgrid-s2`, {
            zoneId: zone.id,
            name: 's2._domainkey',
            type: 'CNAME',
            ttl: 300,
            records: ['s2.domainkey.u2320378.wl129.sendgrid.net.'],
        });

        new Route53Record(this, `record-${domain}-sendgrid-sendgrid`, {
            zoneId: zone.id,
            name: 'sendgrid',
            type: 'CNAME',
            ttl: 300,
            records: ['u2320378.wl129.sendgrid.net.'],
        });

        new Route53Record(this, `record-${domain}-sendgrid-sendgrid2`, {
            zoneId: zone.id,
            name: 'sendgrid2',
            type: 'CNAME',
            ttl: 300,
            records: ['u2777847.wl098.sendgrid.net.'],
        });

        // braze
        new Route53Record(this, `record-${domain}-partners`, {
            zoneId: zone.id,
            name: 'partners',
            type: 'CNAME',
            ttl: 300,
            records: ['eu.sparkpostmail.com.'],
        });

        new Route53Record(this, `record-${domain}-partners-verification`, {
            zoneId: zone.id,
            name: 'scph0122._domainkey.partners',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDA33PeDTeNbfKap88Am4tgVnpO6AQf1KUTMJ5S+CYoqFmT7FqIv/LkylNmr4jwdEYsSIpdB+d1dzpa8gy5Y8T79FT1kwFVGFhvlSHd+fzNKYIYfm2+CqpXY14x8terK5CJQJiM7s9HIFcAnMv9CkYhRhfoqHhd9clFWas2FV4S1wIDAQAB',
            ],
        });

        // staging
        const stagingSubdomains = [
            'arcadegames-1112',
            'gameevents-1078',
            'gamesessions-1080',
            'kraken-1071',
            'kraken-staging',
            'mailtool-1033',
            'offerai2acp-1068',
            'payment-staging',
            'prizetool-1041',
            'retrocasino-1105-admin',
            'retrocasino-1105-api',
            'retrocasino-1105-cockpit',
            'retrocasino-1105-mapi',
            'retrocasino-1105-papi',
            'retrocasino-1105-www',
            'sharedstorage-1028',
            'usercom2-1025',
            'whownet-1064',
        ];

        for (const subdomain of stagingSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerStaging.dnsName,
                    zoneId: loadbalancerStaging.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        // services
        const servicesSubdomains = [
            'auth',
            'arcadegames-112',
            'casinoappassets-302',
            'casinoappassetsindep-303',
            'contentcontrol',
            'crwdtool-46',
            'grafana',
            'idleconfig-65',
            'kraken-71',
            'kraken',
            'layertool-37',
            'mailgateway-92',
            'mailtool-33',
            'offerai2acp-68',
            'partnerrss-87',
            'prizetool-41',
            'retrocasinoappassets-304',
            'sharedstorage-28',
            'treasurehunt2-76',
            'tpixeltool-49',
            'uc2',
            'usercom2-25',
            'whownet-64',
        ];

        for (const subdomain of servicesSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerServices.dnsName,
                    zoneId: loadbalancerServices.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        // retrocasino production
        for (const subdomain of [
            'retrocasino-105-admin',
            'retrocasino-105-api',
            'retrocasino-105-cockpit',
            'retrocasino-105-mapi',
            'retrocasino-105-papi',
            'retrocasino-105-www',
        ]) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerRetrocasino.dnsName,
                    zoneId: loadbalancerRetrocasino.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        // payment
        new Route53Record(this, `record-${domain}-payment`, {
            zoneId: zone.id,
            name: 'payment',
            type: 'A',
            alias: {
                name: loadbalancerServices.dnsName,
                zoneId: loadbalancerServices.zoneId,
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-payid`, {
            zoneId: zone.id,
            name: 'payid',
            type: 'NS',
            ttl: 3600,
            records: ['erika.dns-helper.com', 'fritz.dns-helper.com', 'jane.dns-helper.com', 'john.dns-helper.com'],
        });

        // suite
        new Route53Record(this, `record-${domain}-suite-98`, {
            zoneId: zone.id,
            name: 'suite-98',
            type: 'A',
            alias: {
                name: loadbalancerSuite.dnsName,
                zoneId: loadbalancerSuite.zoneId,
                evaluateTargetHealth: false,
            },
        });

        // m2pslots production
        const m2pslotsProductionSubdomains = [
            'm2p-aladin',
            'm2p-aztecchallenge',
            'm2p-bavarianbeerfest',
            'm2p-blastingwilds',
            'm2p-bloodnight',
            'm2p-bookofbuffalo',
            'm2p-caesarcleopatra',
            'm2p-cashflash',
            'm2p-cavemanwild',
            'm2p-colorburst',
            'm2p-dragonlord',
            'm2p-extreme7',
            'm2p-extremefruits',
            'm2p-extremevoltage',
            'm2p-fireandice',
            'm2p-gameofcats',
            'm2p-hotwildjokers',
            'm2p-jinxyjewels',
            'm2p-luckycatch',
            'm2p-magicmegaplay',
            'm2p-max7fruits',
            'm2p-miamiwild',
            'm2p-monstermadness',
            'm2p-neonlights',
            'm2p-neptuneinlove',
            'm2p-osiris',
            'm2p-pickapinata',
            'm2p-pinkdiamond',
            'm2p-rebound',
            'm2p-spqr',
            'm2p-superfresh7',
            'm2p-supersummer',
            'm2p-tequilasunrise',
            'm2p-toinofgold',
            'm2p-treasuretales',
            'm2p-triggerhappy',
            'm2p-vikings',
            'm2p-vikingssecretmagic',
            'm2p-vipclub',
            'm2p-winterdreams',
            'm2p-wwm',
            'm2p-soa2',
            'm2p-extreme7mini',
            'm2p-soamax',

        ];

        for (const subdomain of m2pslotsProductionSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerM2pProduction.dnsName,
                    zoneId: loadbalancerM2pProduction.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        // m2pslots retrocasino
        const m2pslotsRetrocasinoSubdomains = [
            'm2p-wilds-caesarcleopatra',
            'm2p-wilds-extreme7',
            'm2p-wilds-luckycatch',
            'm2p-wilds-magicmegaplay',
            'm2p-wilds-spqr',
            'm2p-wilds-vipclub',
            'm2p-wilds-wwm',
        ];

        for (const subdomain of m2pslotsRetrocasinoSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerM2pRetrocasino.dnsName,
                    zoneId: loadbalancerM2pRetrocasino.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        // m2pslots staging
        const m2pslotsStagingSubdomains = [
            'm2p-stage-aladin',
            'm2p-stage-blastingwilds',
            'm2p-stage-bookofbuffalo',
            'm2p-stage-caesarcleopatra',
            'm2p-stage-extreme7',
            'm2p-stage-extremefruits',
            'm2p-stage-extremevoltage',
            'm2p-stage-fireandice',
            'm2p-stage-hotwildjokers',
            'm2p-stage-luckycatch',
            'm2p-stage-magicmegaplay',
            'm2p-stage-pickapinata',
            'm2p-stage-rebound',
            'm2p-stage-vipclub',
            'm2p-stage-soa2',
            'm2p-stage-soamax',
            'm2p-stage-extreme7mini',
        ];

        for (const subdomain of m2pslotsStagingSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerM2pStaging.dnsName,
                    zoneId: loadbalancerM2pStaging.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        // others
        new Route53Record(this, `record-${domain}-atlassian`, {
            zoneId: zone.id,
            name: 'atlassian',
            type: 'A',
            ttl: 300,
            records: ['3.120.131.91'],
        });

        new Route53Record(this, `record-${domain}-o1.mail-sg`, {
            zoneId: zone.id,
            name: 'o1.mail-sg',
            type: 'A',
            ttl: 300,
            records: ['192.254.119.204'],
        });

        new Route53Record(this, `record-${domain}-o2.mail-sg`, {
            zoneId: zone.id,
            name: 'o2.mail-sg',
            type: 'A',
            ttl: 300,
            records: ['167.89.90.98'],
        });

        new Route53Record(this, `record-${domain}-o3.mail-sg`, {
            zoneId: zone.id,
            name: 'o3.mail-sg',
            type: 'A',
            ttl: 300,
            records: ['198.37.157.65'],
        });

        new Route53Record(this, `record-${domain}-mtk-assets`, {
            zoneId: zone.id,
            name: 'mtk-assets',
            type: 'CNAME',
            ttl: 300,
            records: ['s-d97b4cf136f943b2b.server.transfer.eu-central-1.amazonaws.com'],
        });

        new Route53Record(this, `record-${domain}-nagios-aws`, {
            zoneId: zone.id,
            name: 'nagios-aws',
            type: 'A',
            ttl: 300,
            records: ['35.158.233.23'],
        });

        new Route53Record(this, `record-${domain}-assets.ie.s3`, {
            zoneId: zone.id,
            name: 'assets.ie.s3',
            type: 'CNAME',
            ttl: 300,
            records: ['s3-website-eu-west-1.amazonaws.com.'],
        });

        new Route53Record(this, `record-${domain}-shared`, {
            zoneId: zone.id,
            name: 'shared',
            type: 'A',
            ttl: 300,
            records: ['213.61.172.106'],
        });

        new Route53Record(this, `record-${domain}-shared2`, {
            zoneId: zone.id,
            name: 'shared2',
            type: 'A',
            ttl: 300,
            records: ['213.61.172.107'],
        });

        new Route53Record(this, `record-${domain}-suite-98-cdn`, {
            zoneId: zone.id,
            name: 'suite-98-cdn',
            type: 'CNAME',
            ttl: 300,
            records: ['suite-98.whow.akamaized.net.'],
        });

        new Route53Record(this, `record-${domain}-sweetsmatch`, {
            zoneId: zone.id,
            name: 'sweetsmatch',
            type: 'A',
            ttl: 300,
            records: ['3.122.201.210'],
        });

        new Route53Record(this, `record-${domain}-github-challenge-whowgames`, {
            zoneId: zone.id,
            name: '_github-challenge-whowgames.www',
            type: 'TXT',
            ttl: 300,
            records: ['a7f0a60189'],
        });

        // elasticips staging
        const stagingElasticIps = [
            { eip: 'casinosocket-1074-01', subdomains: ['casinosocket-1074'] },
            { eip: 'competitions2-1065-02', subdomains: ['competitions2-1065'] },
            { eip: 'competitions3-1065-02', subdomains: ['competitions3-1065'] },
            { eip: 'highrollerduell-1107-02', subdomains: ['highrollerduell-1107'] },
            { eip: 'retrinocasino-105-socket-01', subdomains: ['retrocasino-105-socket-01'] },
            { eip: 'retrinocasino-105-socket-02', subdomains: ['retrocasino-105-socket-02'] },
        ];

        for (const entry of stagingElasticIps) {
            const dataElasticIp = new DataAwsEip(this, `data-elasticip-${entry.eip}`, {
                tags: {
                    Name: `${env.name}-${entry.eip}`,
                },
            });

            for (const subdomain of entry.subdomains) {
                new Route53Record(this, `record-${domain}-${subdomain}`, {
                    zoneId: zone.id,
                    name: subdomain,
                    type: 'A',
                    ttl: 300,
                    records: [dataElasticIp.publicIp],
                });
            }
        }

        // elasticips production
        const productionElasticIps = [
            { eip: 'casinosocket-74-01', subdomains: ['casinosocket-74-shard-01'] },
            { eip: 'casinosocket-74-02', subdomains: ['casinosocket-74-shard-02'] },
            { eip: 'casinosocket-74-03', subdomains: ['casinosocket-74-shard-03'] },
            { eip: 'casinosocket-74-04', subdomains: ['casinosocket-74-shard-04'] },
            { eip: 'competitions2-65-02', subdomains: ['competitions2-65'] },
            { eip: 'competitions3-65-02', subdomains: ['competitions3-65', 'competitions3-65-01'] },
            { eip: 'competitions3-65-03', subdomains: ['competitions3-65-02'] },
            { eip: 'competitions3-65-04', subdomains: ['competitions3-65-03'] },
            { eip: 'competitions3-65-05', subdomains: ['competitions3-65-04'] },
            { eip: 'highrollerduell-65-02', subdomains: ['highrollerduell-107'] },
            { eip: 'whowset-90-01', subdomains: ['whowset'] },
        ];

        for (const entry of productionElasticIps) {
            const dataElasticIp = new DataAwsEip(this, `data-elasticip-${entry.eip}`, {
                tags: {
                    Name: `${env.name}-${entry.eip}`,
                },
            });

            for (const subdomain of entry.subdomains) {
                new Route53Record(this, `record-${domain}-${subdomain}`, {
                    zoneId: zone.id,
                    name: subdomain,
                    type: 'A',
                    ttl: 300,
                    records: [dataElasticIp.publicIp],
                });
            }
        }
    }
}
