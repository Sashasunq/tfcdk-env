import { BabbelAcmAws } from '../generated/modules/babbel/acm/aws';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';

export class AcmRedirectsStack extends Construct {
    constructor(scope: Construct, id: string, env: BaseEnvironment, dataRoute53Zones: Map<string, DataAwsRoute53Zone>) {
        super(scope, id);

        for (const elm of Object.values(env.redirectOnlyDomains)) {
            for (let i = 0; i < elm.length; i++) {
                const certDomains = elm[i];
                const sans = [];
                const domainNamesToZoneIds: { [key: string]: string } = {};

                for (const domain of certDomains) {
                    const zone = dataRoute53Zones.get(domain);

                    sans.push(domain);
                    sans.push(`www.${domain}`);

                    domainNamesToZoneIds[domain] = zone!.id;
                    domainNamesToZoneIds[`www.${domain}`] = zone!.id;
                }

                new BabbelAcmAws(scope, `acm-redirects-${certDomains[0]}`, {
                    primaryDomainName: certDomains[0],
                    domainNamesToZoneIds: domainNamesToZoneIds,
                });
            }
        }
    }
}
