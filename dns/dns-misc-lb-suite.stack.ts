import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsMiscLbSuiteStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, loadbalancerSuite: DataAwsLb) {
        super(scope, id);

        const domains = [
            'elite-slots.com',
            'elite-slots.de',
            'elite-slots.info',
            'elite-slots.net',
            'elite-slots.org',
            'eliteslots.com',
            'eliteslots.de',
            'eliteslots.org',
            'fetter-ist-besser.de',
            'fetteristbesser.de',
            'open-trader.de',
            'opentrader.de',
            'playmini.de',
            'wild-wilma.com',
            'wild-wilma.de',
            'wilde-wilma.com',
            'wilde-wilma.de',
            'wildewillma.com',
            'wildewillma.de',
            'wildewilma.com',
            'wildewilma.de',
            'wildewilmer.com',
            'wildewilmer.de',
            'wildwilma.com',
            'wildwilma.de',
        ];

        for (const domain of domains) {
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
                    name: loadbalancerSuite.dnsName,
                    zoneId: loadbalancerSuite.zoneId,
                    evaluateTargetHealth: false,
                },
            });

            new Route53Record(this, `record-${domain}-www`, {
                zoneId: zone.id,
                name: 'www',
                type: 'A',
                alias: {
                    name: loadbalancerSuite.dnsName,
                    zoneId: loadbalancerSuite.zoneId,
                    evaluateTargetHealth: false,
                },
            });
        }
    }
}
