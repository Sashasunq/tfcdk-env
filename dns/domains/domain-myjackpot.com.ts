import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsEip } from '@cdktf/provider-aws/lib/data-aws-eip';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainMyJackpotCom extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb, dataElasticIpLegacySsl: DataAwsEip) {
        super(scope, id);

        const domain = 'myjackpot.com';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        const suiteSubdomains = ['www', 'secure'];

        const cnameSubdomains = ['nova', 'pelikone'];

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
                'google-site-verification=iQu0CiccSl5Cv0YXu1gEte-YASn3s8epiQJ6WLZKhoU',
                'google-site-verification=_sPff4xq-JPHhL50mo3wV85q5PC4PHvxuyuT8Q6bGfI',
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
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDHvvp15pM/sHCyd0Z+2yQhU5decXnKr/4Ds9PFqxbcGc8I22fru4vbjGz+HNwEQ6QPn+A76RuuI1l5wFg8PmvfnfECFusqdurFtJcoT3BJLVZblw9kGvoCNYCsWBVhCkwtDnHZRuqedt25YAZzEvpwLGtTjT89jF6y5szCJxPbiwIDAQAB',
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
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDN2DJduPDk5qZ0ex5/uYKpu0swXj4SCp7YJkEDIeDb4PFzrvWQIJ5/FO9r0DLocMUa9I/UyinRCPn3cQYjF/MCF91fBzgtMfYELuIFrPTevXfABZnG2u5YDW95ezT8INg66dfEatMiHTPJc79YQAjjejIn6F8/cKMndjCkmFZjCwIDAQAB',
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
    }
}
