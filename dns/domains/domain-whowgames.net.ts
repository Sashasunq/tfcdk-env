import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainWhowgamesNet extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, loadbalancerServices: DataAwsLb) {
        super(scope, id);

        const domain = 'whowgames.net';

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
            records: [env.defaultSpf, 'google-site-verification=StTUadUwxw1FPZB_nd4ldGxXW0t7aDsic5WKXO7Rfr0'],
        });

        new Route53Record(this, `record-${domain}-singleslot-ns`, {
            zoneId: zone.id,
            name: 'singleslot',
            type: 'NS',
            ttl: 300,
            records: ['ns-1937.awsdns-50.co.uk', 'ns-946.awsdns-54.net', 'ns-9.awsdns-01.com', 'ns-1027.awsdns-00.org'],
        });

        new Route53Record(this, `record-${domain}-slotino-ns`, {
            zoneId: zone.id,
            name: 'slotino',
            type: 'NS',
            ttl: 300,
            records: ['ns-1849.awsdns-39.co.uk', 'ns-19.awsdns-02.com', 'ns-1268.awsdns-30.org', 'ns-607.awsdns-11.net'],
        });

        new Route53Record(this, `record-${domain}-sn-ns`, {
            zoneId: zone.id,
            name: 'sn',
            type: 'NS',
            ttl: 300,
            records: ['ns-749.awsdns-29.net', 'ns-1421.awsdns-49.org', 'ns-263.awsdns-32.com', 'ns-1880.awsdns-43.co.uk'],
        });
    }
}
