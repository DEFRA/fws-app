import fs from 'node:fs'
import path from 'node:path'

const data = {}

fs.readdirSync(import.meta.dirname)
  .filter(file => file.endsWith('.json'))
  .forEach(file => {
    data[file.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, file), 'utf8'))
  })

export default data
