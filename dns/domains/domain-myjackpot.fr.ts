import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsEip } from '@cdktf/provider-aws/lib/data-aws-eip';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainMyjackpotFr extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerSuite: DataAwsLb, dataElasticIpLegacySsl: DataAwsEip) {
        super(scope, id);

        const domain = 'myjackpot.fr';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        const suiteSubdomains = ['www'];

        const cnameSubdomains = ['jeux-gratuits', 'lequipe'];

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
            records: [env.defaultSpf, 'google-site-verification=P0XUY10tlPIrKI6l-NIjiG2Crhg4afZMJFCsNcmrJPk'],
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
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdF9xSMoKZptxlxOP8+ncCvWRFDzkeFa8cemG/m5AHGUF2xuqjCGY7XrJAOvoMQvQPQ3+nZyfEOJF831Cti5SWQz9+Gvmn2JqKZaBVPMli8tNLWz8TP+dusVJekR8AEwDjg7mNuyMUTNeujTQLuV34IM+TduEOv/Jn9nK2cG9B5wIDAQAB',
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
                'v=DKIM1; k=rsa; h=sha256; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDXKZRNv4PIYSjsmjH2N0PmZrYm46j1IbGJH34QNUu2saL0Q1sT5mv/tihAMvPjWNN+pNSPshitZ3TmUrNMM4ad2/jdhTfQHMz9gvJ5jN+WHi5m6eIqRwOh3AHCFTJOdHRB+XoUB6L94zjabUQkL34k82ERAcbvPuCFeHbkrC3p7wIDAQAB',
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
