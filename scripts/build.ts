import { parseArgs } from "util"

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    output: {
      type: "string",
      short: "o",
      default: "dist/aws-external-anthropic-token-generator-cli",
    },
    target: {
      type: "string",
      short: "t",
      default: `bun-${process.platform}-${process.arch}`,
    },
  },
})

async function build(compile: Bun.CompileBuildOptions) {
  const result = await Bun.build({
    entrypoints: ["src/index.ts"],
    compile,
  })
  return {
    success: result.success,
    target: compile.target,
    output: result.outputs.map((output) => output.path),
  }
}

if (process.env.CI) {
  const platforms = ["darwin", "linux", "windows"]
  const archs = ["x64", "arm64", "aarch64"]
  const targets = platforms.flatMap((platform) =>
    archs.map((arch) => `bun-${platform}-${arch}` as Bun.Build.CompileTarget)
  )
  const results = await Promise.all(
    targets.map((target) =>
      build({
        outfile: `dist/aws-external-anthropic-token-generator-cli-${target}`,
        target,
      })
    )
  )
  Bun.stdout.write(JSON.stringify(results))
} else {
  Bun.stdout.write(
    JSON.stringify(
      await build({
        outfile: values.output,
        target: values.target as Bun.Build.CompileTarget,
      })
    )
  )
}
