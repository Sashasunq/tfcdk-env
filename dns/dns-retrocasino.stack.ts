import { AcmCertificate } from '@cdktf/provider-aws/lib/acm-certificate';
import { AcmCertificateValidation } from '@cdktf/provider-aws/lib/acm-certificate-validation';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsRetrocasinoStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerRetrocasino: DataAwsLb) {
        super(scope, id);

        // main domain - additional records
        const domain = 'epicwilds.com';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        new Route53Record(this, `record-${domain}-root`, {
            zoneId: zone.id,
            name: domain,
            type: 'A',
            alias: {
                name: loadbalancerRetrocasino.dnsName,
                zoneId: loadbalancerRetrocasino.zoneId,
                evaluateTargetHealth: false,
            },
        });

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
            records: [env.defaultSpf, 'google-site-verification=LR2f8zlq7HkyJomoyO3d6bgUe16xjXjwwlmgP-y6S24'],
        });

        new Route53Record(this, `record-${domain}-www`, {
            zoneId: zone.id,
            name: 'www',
            type: 'A',
            alias: {
                name: loadbalancerRetrocasino.dnsName,
                zoneId: loadbalancerRetrocasino.zoneId,
                evaluateTargetHealth: false,
            },
        });

        const sslEpicWildsCom = new AcmCertificate(scope, `ssl-epicwilds`, {
            domainName: 'epicwilds.com',
            subjectAlternativeNames: ['*.epicwilds.com'],
            validationMethod: 'DNS',
        });

        const record = new Route53Record(this, `record-${domain}-ssl-validation`, {
            name: '${each.value.name}',
            type: '${each.value.type}',
            records: ['${each.value.record}'],
            zoneId: zone.zoneId,
            ttl: 60,
            allowOverwrite: true,
        });

        record.addOverride(
            'for_each',
            `\${{
              for dvo in ${sslEpicWildsCom.fqn}.domain_validation_options : dvo.domain_name => {
                name   = dvo.resource_record_name
                record = dvo.resource_record_value
                type   = dvo.resource_record_type
              }
            }
          }`,
        );

        const certValidation = new AcmCertificateValidation(this, 'ssl-epicwilds-validation', {
            certificateArn: sslEpicWildsCom.arn,
        });

        certValidation.addOverride('validation_record_fqdns', `\${[for record in ${record.fqn} : record.fqdn]}`);

        // secondary domains, only LB entry
        for (const domain of [
            'epic-wilds-casino.com',
            'epic-wilds-casino.de',
            'epic-wilds-casino.net',
            'epic-wilds.com',
            'epic-wilds.de',
            'epic-wilds.net',
            'epicwilds.de',
            'epicwilds.net',
            'epicwildscasino.com',
            'epicwildscasino.de',
            'epicwildscasino.net',
        ]) {
            const zone = new Route53Zone(this, `zone-${domain}`, {
                name: domain,
                tags: {
                    Name: domain,
                },
            });

            new Route53Record(this, `record-${domain}-root`, {
                zoneId: zone.id,
                name: domain,
                type: 'A',
                alias: {
                    name: loadbalancerRetrocasino.dnsName,
                    zoneId: loadbalancerRetrocasino.zoneId,
                    evaluateTargetHealth: false,
                },
            });

            new Route53Record(this, `record-${domain}-www`, {
                zoneId: zone.id,
                name: 'www',
                type: 'CNAME',
                alias: {
                    name: loadbalancerRetrocasino.dnsName,
                    zoneId: loadbalancerRetrocasino.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }
    }
}
