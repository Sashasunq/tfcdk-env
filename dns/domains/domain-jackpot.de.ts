import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsEip } from '@cdktf/provider-aws/lib/data-aws-eip';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainJackpotDe extends Construct {
    constructor(
        scope: Construct,
        id: string,
        env: BaseEnvironment,
        loadbalancerSuite: DataAwsLb,
        loadbalancerServices: DataAwsLb,
        loadbalancerStaging: DataAwsLb,
        dataElasticIpLegacySsl: DataAwsEip,
    ) {
        super(scope, id);

        const domain = 'jackpot.de';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        const suiteSubdomains = ['www', 'admin', 'api-m2p', 'api', 'bonus', 'cockpit', 'live', 'm', 'mapi', 'papi', 'secure'];

        const servicesSubdomains = ['eventlog', 'shared', 'lt', 'mt', 'uc', 'uc2'];

        const cnameSubdomains = [
            'bildspielt',
            'dmax',
            'freenet',
            'gmx',
            'gmxvorteile',
            'krone',
            'love-island',
            'rtl2',
            'rtlspiele',
            't-online',
            'tagesspiegel',
            'tlc',
            'web',
            'webvorteile',
            'yahoo',
        ];

        new Route53Record(this, `record-${domain}-root`, {
            zoneId: zone.id,
            name: domain,
            type: 'A',
            alias: {
                name: loadbalancerSuite.dnsName,
                zoneId: loadbalancerSuite.zoneId,
                evaluateTargetHealth: false,
            },
        });

        for (const subdomain of suiteSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                alias: {
                    name: loadbalancerSuite.dnsName,
                    zoneId: loadbalancerSuite.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }

        for (const subdomain of cnameSubdomains) {
            new Route53Record(this, `record-${domain}-${subdomain}`, {
                zoneId: zone.id,
                name: subdomain,
                type: 'A',
                ttl: 300,
                records: [dataElasticIpLegacySsl.publicIp],
            });
        }

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
            records: [
                env.defaultSpf,
                'google-site-verification=SWZKS6VSw1vxHrOvP_LmkbA_tjFeAngbCK_UNIhkzdg',
                'google-site-verification=w3bgCEHEoIhVU9-0dfxCQqluMWRVG0aym_HQnAGqiUU',
            ],
        });

        new Route53Record(this, `record-${domain}-marketing`, {
            zoneId: zone.id,
            name: 'marketing',
            type: 'CNAME',
            ttl: 300,
            records: ['eu.sparkpostmail.com.'],
        });

        new Route53Record(this, `record-${domain}-marketing-verification`, {
            zoneId: zone.id,
            name: 'scph0320._domainkey.marketing',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9eaC8sGUCyIlY7kQ9n+8xwKjdk80KmBFWhx8af/hJWOGTHEwyBq6WXVuNViyWBRQ0zd5nivha1YGFEtd0w4DKxE47r8eeTBn4p53Gufi5ouH1yYO8m3WpaHsTPiFtBnSYfwOdeM7/s8eZSzO+N3Pn4f5ixqd0ELwCwfjSNR6K1QIDAQAB',
            ],
        });

        new Route53Record(this, `record-${domain}-service`, {
            zoneId: zone.id,
            name: 'service',
            type: 'CNAME',
            ttl: 300,
            records: ['eu.sparkpostmail.com.'],
        });

        new Route53Record(this, `record-${domain}-service-verification`, {
            zoneId: zone.id,
            name: 'scph0320._domainkey.service',
            type: 'TXT',
            ttl: 300,
            records: [
                // eslint-disable-next-line max-len
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuYcUMepVV2GKOUV/6xYbaHz40HwGpHymW4nJEHFUuKGqU0EARSgd6rXRvoIlAyYxjDNFGenmcPhITDTkqTFZzgBQsS8QLRCRSLYdD9/l8NLqort+lTcAw+d+nCRGPWd0ipp2gSnVzFmCRj93Ekve1jshQQlQuFDmZQK2seSwd9QIDAQAB',
            ],
        });

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

        // staging subdomains
        const stagingSubdomains = ['admin', 'api', 'cdn', 'cockpit', 'mapi', 'papi', 'www'];

        for (let i = 1; i < 19; i++) {
            for (const subdomain of stagingSubdomains) {
                new Route53Record(this, `record-${domain}-staging-${i}-${subdomain}`, {
                    zoneId: zone.id,
                    name: `staging-${i}-${subdomain}`,
                    type: 'A',
                    alias: {
                        name: loadbalancerStaging.dnsName,
                        zoneId: loadbalancerStaging.zoneId,
                        evaluateTargetHealth: false,
                    },
                });
            }
        }

        // TODO: SES still on old account
        new Route53Record(this, `record-${domain}-ses-txt`, {
            zoneId: zone.id,
            name: '_amazonses',
            type: 'TXT',
            ttl: 1800,
            records: ['V6p+5r1EHzOkXQMYPuHPBV1Ge7gH8BregLHzqpiyapY='],
        });

        new Route53Record(this, `record-${domain}-ses-domainkey-1`, {
            zoneId: zone.id,
            name: '25j6y4upi23rskwplfp6tno2rybrezjq._domainkey',
            type: 'CNAME',
            ttl: 1800,
            records: ['25j6y4upi23rskwplfp6tno2rybrezjq.dkim.amazonses.com.'],
        });

        new Route53Record(this, `record-${domain}-ses-domainkey-2`, {
            zoneId: zone.id,
            name: '56ptu3p7h6oza4q2r43ffq25a27ofc5b._domainkey',
            type: 'CNAME',
            ttl: 1800,
            records: ['56ptu3p7h6oza4q2r43ffq25a27ofc5b.dkim.amazonses.com.'],
        });

        new Route53Record(this, `record-${domain}-ses-domainkey-3`, {
            zoneId: zone.id,
            name: 'ly4ddpg6c3h3wtrnzg7qublpkqopyahi._domainkey',
            type: 'CNAME',
            ttl: 1800,
            records: ['ly4ddpg6c3h3wtrnzg7qublpkqopyahi.dkim.amazonses.com.'],
        });

        // app
        new Route53Record(this, `record-${domain}-app`, {
            zoneId: zone.id,
            name: 'app',
            type: 'A',
            ttl: 300,
            records: ['92.60.14.3'],
        });
    }
}
