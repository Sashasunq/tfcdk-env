import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsLb } from '@cdktf/provider-aws/lib/data-aws-lb';
import { Route53Record } from '@cdktf/provider-aws/lib/route53-record';
import { Route53Zone } from '@cdktf/provider-aws/lib/route53-zone';

export class DnsDomainTigerkingDe extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, loadbalancerServices: DataAwsLb, loadbalancerStaging: DataAwsLb) {
        super(scope, id);

        const domain = 'tigerking.de';

        const zone = new Route53Zone(this, `zone-${domain}`, {
            name: domain,
            tags: {
                Name: domain,
            },
        });

        // prod
        new Route53Record(this, `record-${domain}-root`, {
            zoneId: zone.id,
            name: domain,
            type: 'A',
            alias: {
                name: 'dkjbnb64hrnna.cloudfront.net.',
                zoneId: 'Z2FDTNDATAQYW2',
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-www`, {
            zoneId: zone.id,
            name: 'www',
            type: 'A',
            alias: {
                name: 'dkjbnb64hrnna.cloudfront.net.',
                zoneId: 'Z2FDTNDATAQYW2',
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-api`, {
            zoneId: zone.id,
            name: 'api',
            type: 'A',
            alias: {
                name: loadbalancerServices.dnsName,
                zoneId: loadbalancerServices.zoneId,
                evaluateTargetHealth: false,
            },
        });

        // staging
        new Route53Record(this, `record-${domain}-sittard`, {
            zoneId: zone.id,
            name: 'sittard',
            type: 'A',
            alias: {
                name: 'dkjbnb64hrnna.cloudfront.net.',
                zoneId: 'Z2FDTNDATAQYW2',
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-staging-1-www`, {
            zoneId: zone.id,
            name: 'staging-1-www',
            type: 'A',
            alias: {
                name: 'd1rwzoi9b47qym.cloudfront.net.',
                zoneId: 'Z2FDTNDATAQYW2',
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-staging-1-api`, {
            zoneId: zone.id,
            name: 'staging-1-api',
            type: 'A',
            alias: {
                name: loadbalancerStaging.dnsName,
                zoneId: loadbalancerStaging.zoneId,
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-staging-2-www`, {
            zoneId: zone.id,
            name: 'staging-2-www',
            type: 'A',
            alias: {
                name: 'd1x807fpw9zj28.cloudfront.net.',
                zoneId: 'Z2FDTNDATAQYW2',
                evaluateTargetHealth: false,
            },
        });

        new Route53Record(this, `record-${domain}-staging-2-api`, {
            zoneId: zone.id,
            name: 'staging-2-api',
            type: 'A',
            alias: {
                name: loadbalancerStaging.dnsName,
                zoneId: loadbalancerStaging.zoneId,
                evaluateTargetHealth: false,
            },
        });

        // acm
        const acmCnames = {
            _8afc7207662503b5099e4fb38f5957f3: '_3668eb18d8a74da45508b3de2fb25f3c.bdvkfdzfbg.acm-validations.aws.',
            '_ccfd77feb01b88762c044a553790147a.www': '_527aa9c51b2a99c972f66c1cf8e810e2.ffbjkxtvyn.acm-validations.aws.',
            '_5cc6918b62956f6955c6864ce19ee266.sittard': '_f18d4d7d45dcad52a4567bfceab0c07d.kqlycvwlbp.acm-validations.aws.',
            '_43dba71a76e5f31bfa19270214f1a7b6.staging-1-www': '_c6c1376a478b06c8896b8dbc3e6d4bca.nhsllhhtvj.acm-validations.aws.',
            '_0410d1bb15831d1114d945b988c055c7.staging-2-www': '_a8060bdf0b3723c02fa27b630cb35b0e.tjztrygkxr.acm-validations.aws.',
        };

        for (const [k, v] of Object.entries(acmCnames)) {
            new Route53Record(this, `record-${domain}-${k}`, {
                zoneId: zone.id,
                name: k,
                type: 'CNAME',
                ttl: 60,
                records: [v],
            });
        }
    }
}
