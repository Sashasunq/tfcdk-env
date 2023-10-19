import { BaseEnvironment } from '../../environments/base-environment';
import { Construct } from 'constructs';
import { Lb } from '@cdktf/provider-aws/lib/lb';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { SslCertificatesStack } from '../base/ssl-certificates.stack';
import { VpcStack } from '../base/vpc.stack';
import { WebserverPoolStack } from '../product/webserver-pool.stack';

export class LoadbalancerRedirectsStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        _env: BaseEnvironment,
        vpc: VpcStack,
        securityGroups: SecurityGroupsStack,
        _sslCertificates: SslCertificatesStack,
        _webserverPools: Map<string, WebserverPoolStack>,
    ) {
        super(scope, id);

        /*const lb =*/ new Lb(scope, 'elb-redirects', {
            name: 'elb-redirects',
            internal: false,
            loadBalancerType: 'application',
            securityGroups: [securityGroups.get('default'), securityGroups.get('http'), securityGroups.get('https')],
            subnets: vpc.publicSubnets,
            preserveHostHeader: true,
            idleTimeout: 120,
            tags: {
                Name: 'elb-suite',
                'map-migrated': 'd-server-00agfbylfxkr4x',
            },
        });

        /*
        const listenerHttp = new LbListener(scope, `elb-redirects-listener-http`, {
            loadBalancerArn: lb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-01')?.lbTarget.arn,
                },
            ],
        });

        const listenerHttps = new LbListener(scope, `elb-redirects-listener-https`, {
            loadBalancerArn: lb.arn,
            port: 443,
            protocol: 'HTTPS',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-01')?.lbTarget.arn,
                },
            ],
            certificateArn: sslCertificates.sslWhowNet.arn,
        });

        new LbListenerCertificate(scope, `elb-redirects-listener-https-whow-net`, {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslWhowNet.arn,
        });

        let count = 0;

        for (const certificate of sslCertificates.sslRedirects) {
            new LbListenerCertificate(scope, `elb-redirects-listener-https-${count}`, {
                listenerArn: listenerHttps.arn,
                certificateArn: certificate.arn,
            });

            count++;
        }

        // generate rules, only pool-01 skipped as its default..
        let priority = 110;

        for (const pool in env.redirectOnlyDomains) {
            if (pool === 'pool-01') {
                continue;
            }

            for (let i = 0; i < env.redirectOnlyDomains[pool].length; i++) {
                const hosts = [];

                for (const domain of env.redirectOnlyDomains[pool][i]) {
                    hosts.push(domain);
                    hosts.push(`www.${domain}`);
                }

                console.log(hosts);

                const rules: Partial<LbListenerRuleConfig> = {
                    priority,
                    action: [
                        {
                            type: 'forward',
                            targetGroupArn: webserverPools.get(pool)?.lbTarget.arn,
                        },
                    ],
                    condition: [
                        {
                            hostHeader: {
                                values: hosts,
                            },
                        },
                    ],
                };

                new LbListenerRule(scope, `elb-redirects-http-rule-${priority}`, <LbListenerRuleConfig>{
                    ...rules,
                    listenerArn: listenerHttp.arn,
                });

                new LbListenerRule(scope, `elb-redirects-https-rule-${priority}`, <LbListenerRuleConfig>{
                    ...rules,
                    listenerArn: listenerHttps.arn,
                });

                priority++;
            }
        }
        */
    }
}
