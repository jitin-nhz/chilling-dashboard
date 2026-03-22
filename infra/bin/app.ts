#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ChillingDashboardAmplifyStack } from "../lib/amplify-stack";

const app = new cdk.App();

new ChillingDashboardAmplifyStack(app, "ChillingDashboardAmplify", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  },
  description: "ChillingApp AI Analytics Dashboard — Amplify Hosting (Convergence India 2026)",

  // GitHub source
  githubOwner: "jitin-nhz",
  githubRepo: "chilling-dashboard",

  // Store GitHub PAT in Secrets Manager — see README for setup
  // Run: aws secretsmanager create-secret --name chilling-dashboard/github-token --secret-string "ghp_xxxx"
  githubTokenSecretArn: `arn:aws:secretsmanager:${process.env.CDK_DEFAULT_REGION ?? "us-east-1"}:${process.env.CDK_DEFAULT_ACCOUNT}:secret:chilling-dashboard/github-token`,

  // Custom domain
  domainName: "9hz.dev",
  subDomain: "ott",
  branch: "main",
});
