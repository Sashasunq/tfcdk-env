import { Construct } from 'constructs';
import { Lb } from '@cdktf/provider-aws/lib/lb';
import { LbListener } from '@cdktf/provider-aws/lib/lb-listener';
import { LbListenerCertificate } from '@cdktf/provider-aws/lib/lb-listener-certificate';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { SslCertificatesStack } from '../base/ssl-certificates.stack';
import { VpcStack } from '../base/vpc.stack';
import { WebserverPoolStack } from '../product/webserver-pool.stack';

export class LoadbalancerRetrocasinoStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        vpc: VpcStack,
        securityGroups: SecurityGroupsStack,
        sslCertificates: SslCertificatesStack,
        webserverPools: Map<string, WebserverPoolStack>,
    ) {
        super(scope, id);

        const lb = new Lb(scope, 'elb-retrocasino', {
            name: 'elb-retrocasino',
            internal: false,
            loadBalancerType: 'application',
            securityGroups: [securityGroups.get('default'), securityGroups.get('http'), securityGroups.get('https')],
            subnets: vpc.publicSubnets,
            preserveHostHeader: true,
            tags: {
                Name: 'elb-retrocasino',
                'map-migrated': 'd-server-00uyccibz7gf71',
            },
        });

        new LbListener(scope, 'elb-retrocasino-listener-http', {
            loadBalancerArn: lb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-06')?.lbTarget.arn,
                },
            ],
        });

        const listenerHttps = new LbListener(scope, 'elb-retrocasino-listener-https', {
            loadBalancerArn: lb.arn,
            port: 443,
            protocol: 'HTTPS',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-06')?.lbTarget.arn,
                },
            ],
            certificateArn: sslCertificates.sslWhowNet.arn,
        });

        new LbListenerCertificate(scope, 'elb-retrocasino-listener-https-epicwilds-com', {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslEpicWilds.arn,
        });
    }
}
