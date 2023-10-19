import { Construct } from 'constructs';
import { Lb } from '@cdktf/provider-aws/lib/lb';
import { LbListener } from '@cdktf/provider-aws/lib/lb-listener';
import { LbListenerCertificate } from '@cdktf/provider-aws/lib/lb-listener-certificate';
import { LbListenerRule, LbListenerRuleConfig } from '@cdktf/provider-aws/lib/lb-listener-rule';
import { MicroServiceStack } from '../product/micro-service.stack';
import { SecurityGroupsStack } from '../base/security-groups.stack';
import { SslCertificatesStack } from '../base/ssl-certificates.stack';
import { VpcStack } from '../base/vpc.stack';
import { WebserverPoolStack } from '../product/webserver-pool.stack';

export class LoadbalancerStagingStack extends Construct {
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

        // BASE
        const lb = new Lb(scope, `elb-staging`, {
            name: 'elb-staging',
            internal: false,
            loadBalancerType: 'application',
            securityGroups: [securityGroups.get('default'), securityGroups.get('http'), securityGroups.get('https')],
            subnets: vpc.publicSubnets,
            preserveHostHeader: true,
            tags: {
                Name: 'elb-staging',
                'map-migrated': 'd-server-001wrw8wvbghz8',
            },
        });

        const listenerHttp = new LbListener(scope, `elb-staging-listener-http`, {
            loadBalancerArn: lb.arn,
            port: 80,
            protocol: 'HTTP',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-staging8')?.lbTarget.arn,
                },
            ],
        });

        const listenerHttps = new LbListener(scope, `elb-staging-listener-https`, {
            loadBalancerArn: lb.arn,
            port: 443,
            protocol: 'HTTPS',
            defaultAction: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-staging8')?.lbTarget.arn,
                },
            ],
            certificateArn: sslCertificates.sslWhowNet.arn,
        });

        new LbListenerCertificate(scope, `elb-staging-listener-https-jackpot-de`, {
            listenerArn: listenerHttps.arn,
            certificateArn: sslCertificates.sslJackpotDe.arn,
        });

        for (let [index, cert] of sslCertificates.sslTigerkingDeStaging.entries()) {
            new LbListenerCertificate(scope, `elb-staging-listener-https-staging-`+(index+1), {
                listenerArn: listenerHttps.arn,
                certificateArn: cert.arn,
            });
        }

        // GAME SESSION
        const ruleGameSessions = {
            priority: 100,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('gamesessions-1080')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/game_sessions/action/*/node-*'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-gamesessions`, {
            ...ruleGameSessions,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-gamesessions`, {
            ...ruleGameSessions,
            listenerArn: listenerHttps.arn,
        });

        // PUBLISHER PROXY
        const rulePublisherProxy = {
            priority: 105,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('publisherproxy-1097')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/playngo/*', '/pragmatic/*'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-publisherproxy`, {
            ...rulePublisherProxy,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-publisherproxy`, {
            ...rulePublisherProxy,
            listenerArn: listenerHttps.arn,
        });

        // GAME EVENTS
        const ruleGameEvents = {
            priority: 110,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('gameevents-1078')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    pathPattern: {
                        values: ['/game_events/action/trigger/*'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-gameevents`, {
            ...ruleGameEvents,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-gameevents`, {
            ...ruleGameEvents,
            listenerArn: listenerHttps.arn,
        });

        // SERVICES PHP7
        const ruleServices: Partial<LbListenerRuleConfig> = {
            priority: 120,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-staging7')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: [
                            'prizetool-1041.whow.net',
                            'sharedstorage-1028.whow.net',
                            'usercom2-1025.whow.net',
                            'whownet-1064.whow.net',
                        ],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-pool-staging7-services`, <LbListenerRuleConfig>{
            ...ruleServices,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-pool-staging7-services`, <LbListenerRuleConfig>{
            ...ruleServices,
            listenerArn: listenerHttps.arn,
        });

        // KRAKEN
        const ruleKraken = {
            priority: 121,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: webserverPools.get('pool-staging7')?.lbTarget.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['kraken-1071.whow.net', 'kraken-staging.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-pool-staging7-kraken`, {
            ...ruleKraken,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-pool-staging7-kraken`, {
            ...ruleKraken,
            listenerArn: listenerHttps.arn,
        });

        // OFFERAI
        const ruleOfferai: Partial<LbListenerRuleConfig> = {
            priority: 130,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('offerai-1054')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['offerai2acp-1068.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-offerai`, <LbListenerRuleConfig>{
            ...ruleOfferai,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-offerai`, <LbListenerRuleConfig>{
            ...ruleOfferai,
            listenerArn: listenerHttps.arn,
        });

        // ARCADEGAMES
        const ruleArcadegames = {
            priority: 140,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('arcadegames-1112')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['arcadegames-1112.whow.net'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-arcadegames`, {
            ...ruleArcadegames,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-arcadegames`, {
            ...ruleArcadegames,
            listenerArn: listenerHttps.arn,
        });

        // TIGERKING
        const ruleTigerkingStaging1 = {
            priority: 200,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('tigerking-1119')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['staging-1-api.tigerking.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-tigerkingStaging1`, {
            ...ruleTigerkingStaging1,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-tigerkingStaging1`, {
            ...ruleTigerkingStaging1,
            listenerArn: listenerHttps.arn,
        });

        const ruleTigerkingStaging2 = {
            priority: 201,
            action: [
                {
                    type: 'forward',
                    targetGroupArn: microServices.get('tigerking-2119')?.lbTarget?.arn,
                },
            ],
            condition: [
                {
                    hostHeader: {
                        values: ['staging-2-api.tigerking.de'],
                    },
                },
            ],
        };

        new LbListenerRule(scope, `elb-staging-http-rule-tigerkingStaging2`, {
            ...ruleTigerkingStaging2,
            listenerArn: listenerHttp.arn,
        });

        new LbListenerRule(scope, `elb-staging-https-rule-tigerkingStaging2`, {
            ...ruleTigerkingStaging2,
            listenerArn: listenerHttps.arn,
        });
    }
}
