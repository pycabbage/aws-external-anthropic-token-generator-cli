import { getTokenProvider } from "@aws/token-generator-for-aws-external-anthropic"

try {
  const provideToken = getTokenProvider()
  Bun.stdout.write(await provideToken())
} catch (error) {
  Bun.stderr.write(`${error}`)
  process.exit(1)
}
