import { getTokenProvider } from "@aws/token-generator-for-aws-external-anthropic"
import { parseArgs } from "util"

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    profile: {
      type: "string",
      short: "p",
    },
  },
})

try {
  const provideToken = getTokenProvider(
    values.profile
      ? {
          profile: values.profile,
        }
      : undefined
  )
  Bun.stdout.write(await provideToken())
} catch (error) {
  Bun.stderr.write(`${error}`)
  process.exit(1)
}
