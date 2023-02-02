import { Octokit } from "@octokit/core";

// export const octokit = new Octokit({ auth: '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' });
export const octokit = new Octokit({ auth: process.env.GITHUB_API_TOKEN });