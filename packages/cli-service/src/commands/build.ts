import pkgDir from 'pkg-dir'
import chalk from 'chalk'
import { build } from 'vite'
import { BuildPrinter } from '../Printer'
import { loadPackageJson } from '../utils/file'

export default async function (execPath?: string): Promise<void> {
  const rootDir: string | undefined = execPath
    ? execPath
    : await pkgDir(process.cwd())
  if (!rootDir) {
    return
  }

  const print = new BuildPrinter(rootDir)
  const packageConfig = loadPackageJson(rootDir)
  if (packageConfig) {
    const { devDependencies = {}, dependencies = {} } = packageConfig
    if (devDependencies.vite || dependencies.vite) {
      await build(print.getSchema())
    } else {
      console.log("Cannot find module 'vite', try running: npm install vite")
      console.log(chalk.red('Build failed'))
      console.log()
    }
  } else {
    console.log(chalk.red('Build failed'))
    console.log()
  }
}
