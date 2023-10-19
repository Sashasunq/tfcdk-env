import { BabbelAcmAws } from '../generated/modules/babbel/acm/aws';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';

export class AcmTigerkingStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, dataRoute53Zones: Map<string, DataAwsRoute53Zone>) {
        super(scope, id);

        new BabbelAcmAws(scope, `acm-tigerking-0`, {
            primaryDomainName: 'api.tigerking.de',
            domainNamesToZoneIds: {
                'api.tigerking.de': dataRoute53Zones.get('tigerking.de')!.id,
            },
        });

        new BabbelAcmAws(scope, `acm-tigerking-1`, {
            primaryDomainName: 'staging-1-api.tigerking.de',
            domainNamesToZoneIds: {
                'staging-1-api.tigerking.de': dataRoute53Zones.get('tigerking.de')!.id,
            },
        });

        new BabbelAcmAws(scope, `acm-tigerking-2`, {
            primaryDomainName: 'staging-2-api.tigerking.de',
            domainNamesToZoneIds: {
                'staging-2-api.tigerking.de': dataRoute53Zones.get('tigerking.de')!.id,
            },
        });
    }
}
