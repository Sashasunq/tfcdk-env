import { Construct } from 'constructs';
import { DataAwsSecurityGroup } from '@cdktf/provider-aws/lib/data-aws-security-group';
import { DataAwsSubnets } from '@cdktf/provider-aws/lib/data-aws-subnets';
import { DataAwsVpc } from '@cdktf/provider-aws/lib/data-aws-vpc';
import { Lb } from '@cdktf/provider-aws/lib/lb';
import { LbListener } from '@cdktf/provider-aws/lib/lb-listener';
import { LbListenerRule } from '@cdktf/provider-aws/lib/lb-listener-rule';
import { M2pBaseStack } from './m2p-base.stack';
import { M2pSlotConfig } from '../../environments/base-environment';
import { M2pSlotStack } from './m2p-slot.stack';
import { SslCertificatesStack } from '../base/ssl-certificates.stack';

export class M2pLoadbalancerRetrocasinoStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        sslCertificates: SslCertificatesStack,
        m2pBase: M2pBaseStack,
        m2pSlotConfigs: M2pSlotConfig[],
        m2pSlots: Map<string, M2pSlotStack>,
        data: {
            vpc: DataAwsVpc;
            privateSubnets: DataAwsSubnets;
            publicSubnets: DataAwsSubnets;
            securityGroups: Map<string, DataAwsSecurityGroup>;
        },
    ) {
        super(scope, id);

        // bookkeeper lb
        const bookkeeperLb = new Lb(scope, `elb-m2pslots-bookkeeper-104`, {
            name: 'elb-m2pslots-bookkeeper-104',
            internal: true,
            loadBalancerType: 'application',
            securityGroups: [data.securityGroups.get('default')!.id, data.securityGroups.get('sg-http')!.id],
            subnets: data.privateSubnets.ids,
            preserveHostHeader: true,
            tags: {
                Name: 'elb-m2pslots-bookkeeper-104',
                Project: 'm2pslots-104',
                'map-migrated': 'd-server-00uyccibz7gf71',
            },
        });

        new LbListener(scope, `elb-m2pslosts-staging-104-listener`, {
            loadBalancerArn: bookkeeperLb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: m2pBase.bookkeeperTargetRetroProduction.arn,
                },
            ],
        });

        // slots lb
        const lb = new Lb(scope, `elb-m2pslots-104`, {
            name: 'elb-m2pslots-104',
            internal: false,
            loadBalancerType: 'application',
            securityGroups: [
                data.securityGroups.get('default')!.id,
                data.securityGroups.get('sg-http')!.id,
                data.securityGroups.get('sg-https')!.id,
            ],
            subnets: data.publicSubnets.ids,
            preserveHostHeader: true,
            tags: {
                Name: 'elb-m2pslots-104',
                Project: 'm2pslots-104',
                'map-migrated': 'd-server-00uyccibz7gf71',
            },
        });

        const listenerHttp = new LbListener(scope, `elb-m2pslots-104-listener-http`, {
            loadBalancerArn: lb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultAction: [
                {
                    type: 'fixed-response',
                    fixedResponse: {
                        contentType: 'text/plain',
                        statusCode: '404',
                        messageBody: `404 Not Found\n`,
                    },
                },
            ],
        });

        const listenerHttps = new LbListener(scope, `elb-m2pslots-104-listener-https`, {
            loadBalancerArn: lb.arn,
            port: 443,
            protocol: 'HTTPS',
            defaultAction: [
                {
                    type: 'fixed-response',
                    fixedResponse: {
                        contentType: 'text/plain',
                        statusCode: '404',
                        messageBody: `404 Not Found\n`,
                    },
                },
            ],
            certificateArn: sslCertificates.sslWhowNet.arn,
        });

        let priority = 100;

        for (const m2pSlotConfig of m2pSlotConfigs) {
            if (m2pSlotConfig.staging) {
                continue;
            }

            if (!m2pSlotConfig.retrocasino) {
                continue;
            }

            const rule = {
                priority: priority,
                action: [
                    {
                        type: 'forward',
                        targetGroupArn: m2pSlots.get(m2pSlotConfig.name)?.lbTarget.arn,
                    },
                ],
                condition: [
                    {
                        hostHeader: {
                            values: m2pSlotConfig.domains,
                        },
                    },
                ],
            };

            new LbListenerRule(scope, `elb-m2pslots-staging-http-rule-${m2pSlotConfig.name}`, {
                ...rule,
                listenerArn: listenerHttp.arn,
            });

            new LbListenerRule(scope, `elb-m2pslots-staging-https-rule-${m2pSlotConfig.name}`, {
                ...rule,
                listenerArn: listenerHttps.arn,
            });

            priority++;
        }
    }
}
