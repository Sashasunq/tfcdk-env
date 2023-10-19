import { BabbelAcmAws } from '../generated/modules/babbel/acm/aws';
import { BaseEnvironment } from '../environments/base-environment';
import { Construct } from 'constructs';
import { DataAwsRoute53Zone } from '@cdktf/provider-aws/lib/data-aws-route53-zone';

export class AcmSpielbrauseStack extends Construct {
    constructor(scope: Construct, id: string, _env: BaseEnvironment, dataRoute53Zones: Map<string, DataAwsRoute53Zone>) {
        super(scope, id);

        const domains = ['mapi.spielbrause.net'];

        const certDomains = domains;
        const sans: string[] = [];
        const domainNamesToZoneIds: { [key: string]: string } = {};

        for (const domain of certDomains) {
            const tmp = domain.split('.');

            if (tmp[0] === 'mapi') {
                tmp.shift();
            }

            const rootDomain = tmp.join('.');

            const zone = dataRoute53Zones.get(rootDomain);

            sans.push(domain);

            domainNamesToZoneIds[domain] = zone!.id;
        }

        new BabbelAcmAws(scope, `acm-spielbrause-0`, {
            primaryDomainName: certDomains[0],
            domainNamesToZoneIds: domainNamesToZoneIds,
        });
    }
}
