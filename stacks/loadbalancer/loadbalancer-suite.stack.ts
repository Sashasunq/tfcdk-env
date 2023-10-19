import { Construct } from 'constructs';
import { Lb } from '@cdktf/provider-aws/lib/lb';
import { LbListener } from '@cdktf/provider-aws/lib/lb-listener';
import { LbListenerCertificate } from '@cdktf/provider-aws/lib/lb-listener-certificate';
import { LbListenerRule } from '@cdktf/provider-aws/lib/lb-listener-rule';
import { MicroServiceStack } from '../product/micro-service.stack';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { SslCertificatesStack } from '../base/ssl-certificates.stack';
import { VpcStack } from '../base/vpc.stack';
import { WebserverPoolStack } from '../product/webserver-pool.stack';

export class LoadbalancerSuiteStack extends Construct {
    constructor(
        scope: Construct,
        id: string,
        vpc: VpcStack,
        securityGroups: SecurityGroupsStack,
        sslCertificates: SslCertificatesStack,
        webserverPools: Map<string, WebserverPoolStack>,
        microServices: Map<string, MicroServiceStack>,
    ) {
        super(scope, id);

        const lb = new Lb(scope, 'elb-suite', {
            name: 'elb-suite',
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

        const listenerHttp = new LbListener(scope, `elb-suite-listener-http`, {
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

        const listenerHttps = new LbListener(scope, `elb-suite-listener-https`, {
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

        new LbListenerCertificate(scope, `elb-suite-listener-https-jackpot-de`, {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslJackpotDe.arn,
        });

        let sslJackpotCertificateCount = 0;

        for (const certificate of sslCertificates.sslJackpotsAndWhitelabels) {
            new LbListenerCertificate(scope, `elb-suite-listener-https-jackpots-${sslJackpotCertificateCount}`, {
                listenerArn: listenerHttps.arn,
                certificateArn: certificate.arn,
            });

            sslJackpotCertificateCount++;
        }

        new LbListenerCertificate(scope, 'elb-suite-listener-https-spielbrause', {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslSpielbrause.arn,
        });

        // GAME SESSION
        const ruleGameSessions = {
            priority: 100,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('gamesessions-80')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/game_sessions/action/*/node-*'],
                    },
                },
                {
                    hostHeader: {
                        values: ['api.jackpot.de', 'api.whow.com', 'api-m2p.jackpot.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-suite-http-rule-gamesessions`, {
            ...ruleGameSessions,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-suite-https-rule-gamesessions`, {
            ...ruleGameSessions,
            listenerArn: listenerHttps.arn,
        });

        // PUBLISHER PROXY
        const rulePublisherProxyPlayNgo = {
            priority: 105,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('publisherproxy-97')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/playngo', '/playngo/*'],
                    },
                },
                {
                    hostHeader: {
                        values: ['api.jackpot.de', 'api.whow.com', 'api-m2p.jackpot.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-suite-http-rule-publisherproxy-playngo`, {
            ...rulePublisherProxyPlayNgo,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-suite-https-rule-publisherproxy-playngo`, {
            ...rulePublisherProxyPlayNgo,
            listenerArn: listenerHttps.arn,
        });

        const rulePublisherProxyPragmatic = {
            priority: 106,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('publisherproxy-97')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/pragmatic', '/pragmatic/*'],
                    },
                },
                {
                    hostHeader: {
                        values: ['api.jackpot.de', 'api.whow.com', 'api-m2p.jackpot.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-suite-http-rule-publisherproxy-pragmatic`, {
            ...rulePublisherProxyPragmatic,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-suite-https-rule-publisherproxy-pragmatic`, {
            ...rulePublisherProxyPragmatic,
            listenerArn: listenerHttps.arn,
        });

        // GAME EVENTS
        const ruleGameEvents = {
            priority: 110,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('gameevents-78')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/game_events/action/trigger/*'],
                    },
                },
                {
                    hostHeader: {
                        values: ['api.jackpot.de', 'api.whow.com', 'api-m2p.jackpot.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-suite-http-rule-gameevents`, {
            ...ruleGameEvents,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-suite-https-rule-gameevents`, {
            ...ruleGameEvents,
            listenerArn: listenerHttps.arn,
        });
    }
}
