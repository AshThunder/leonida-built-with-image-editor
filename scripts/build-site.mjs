import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = resolve(root, 'site-dist')

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

execSync('npm run build -w site', { cwd: root, stdio: 'inherit' })
execSync('npm run build -w leonida-stories', { cwd: root, stdio: 'inherit' })
execSync('npm run build -w billboard-hijack', { cwd: root, stdio: 'inherit' })

cpSync(resolve(root, 'apps/site/dist'), out, { recursive: true })
cpSync(resolve(root, 'apps/leonida-stories/dist'), resolve(out, 'stories'), { recursive: true })
cpSync(resolve(root, 'apps/billboard-hijack/dist'), resolve(out, 'hijack'), { recursive: true })
console.log('site-dist ready')
