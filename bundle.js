const fs = require('fs')
const parser = require('@babel/parser')

const getModuleInfo = file => {
  const body = fs.readFileSync(file, 'utf-8')
  const ast = parser.parse(body, {
    sourceType: 'module'
  })
  console.log('ast: ', ast.program.body);
}

getModuleInfo('./src/index.js')