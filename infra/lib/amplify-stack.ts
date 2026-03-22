import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";

export interface ChillingDashboardAmplifyStackProps extends cdk.StackProps {
  githubOwner: string;
  githubRepo: string;
  githubTokenSecretArn: string; // ARN of Secrets Manager secret holding GitHub PAT
  domainName: string;           // e.g. "9hz.dev"
  subDomain: string;            // e.g. "ott"
  branch?: string;              // defaults to "main"
}

export class ChillingDashboardAmplifyStack extends cdk.Stack {
  public readonly appId: string;
  public readonly appUrl: string;

  constructor(scope: Construct, id: string, props: ChillingDashboardAmplifyStackProps) {
    super(scope, id, props);

    const branch = props.branch ?? "main";

    // ── Retrieve GitHub token from Secrets Manager ───────────────────────────
    const githubToken = secretsmanager.Secret.fromSecretCompleteArn(
      this,
      "GithubToken",
      props.githubTokenSecretArn
    );

    // ── Amplify App ─────────────────────────────────────────────────────────
    const amplifyApp = new amplify.CfnApp(this, "ChillingDashboardApp", {
      name: "chilling-dashboard",
      repository: `https://github.com/${props.githubOwner}/${props.githubRepo}`,
      oauthToken: githubToken.secretValue.unsafeUnwrap(),
      platform: "WEB",
      buildSpec: [
        "version: 1",
        "frontend:",
        "  phases:",
        "    preBuild:",
        "      commands:",
        "        - npm ci",
        "    build:",
        "      commands:",
        "        - npm run build",
        "  artifacts:",
        "    baseDirectory: out",
        "    files:",
        "      - '**/*'",
        "  cache:",
        "    paths:",
        "      - node_modules/**/*",
        "      - .next/cache/**/*",
      ].join("\n"),
      environmentVariables: [
        { name: "AMPLIFY_MONOREPO_APP_ROOT", value: "." },
        { name: "NODE_VERSION", value: "20" },
      ],
      customRules: [
        // SPA routing — serve index.html for all routes
        {
          source: "/<*>",
          target: "/index.html",
          status: "404-200",
        },
      ],
      enableBranchAutoDeletion: false,
    });

    // ── Main Branch ──────────────────────────────────────────────────────────
    const mainBranch = new amplify.CfnBranch(this, "MainBranch", {
      appId: amplifyApp.attrAppId,
      branchName: branch,
      enableAutoBuild: true,
      enablePullRequestPreview: false,
      stage: "PRODUCTION",
    });

    // ── Custom Domain ─────────────────────────────────────────────────────────
    const customDomain = new amplify.CfnDomain(this, "CustomDomain", {
      appId: amplifyApp.attrAppId,
      domainName: props.domainName,
      subDomainSettings: [
        {
          branchName: branch,
          prefix: props.subDomain,
        },
      ],
      enableAutoSubDomain: false,
    });

    customDomain.addDependency(mainBranch);

    // ── Outputs ───────────────────────────────────────────────────────────────
    this.appId = amplifyApp.attrAppId;
    this.appUrl = `https://${props.subDomain}.${props.domainName}`;

    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: amplifyApp.attrAppId,
      description: "Amplify App ID",
    });

    new cdk.CfnOutput(this, "AmplifyDefaultDomain", {
      value: `https://${branch}.${amplifyApp.attrDefaultDomain}`,
      description: "Amplify default domain (available immediately)",
    });

    new cdk.CfnOutput(this, "CustomDomainUrl", {
      value: this.appUrl,
      description: "Custom domain URL (active after DNS propagation)",
    });
  }
}
