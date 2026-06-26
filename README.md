# aws-external-anthropic-token-generator-cli

A CLI tool that generates Anthropic API tokens from AWS credentials. Intended to be used as an `apiKeyHelper` in Claude Code's `settings.json`.

## Prerequisites

- AWS credentials configured (via `~/.aws/credentials`, environment variables, or IAM role)

## Installation

Download the binary for your platform from the [releases page](https://github.com/pycabbage/aws-external-anthropic-token-generator-cli/releases/latest).

## Usage

```bash
# Use default AWS profile
./aws-external-anthropic-token-generator-cli

# Use a specific AWS profile
./aws-external-anthropic-token-generator-cli --profile my-profile
# or
./aws-external-anthropic-token-generator-cli -p my-profile
```

## Setup with Claude Code

Add `apiKeyHelper` to your Claude Code `settings.json` (typically at `~/.claude/settings.json`):

```json
{
  "apiKeyHelper": "/path/to/aws-external-anthropic-token-generator-cli"
}
```

To use a specific AWS profile:m

```json
{
  "apiKeyHelper": "/path/to/aws-external-anthropic-token-generator-cli --profile my-profile"
}
```

Claude Code will execute this command each time it needs an API key, using the returned token for authentication.
