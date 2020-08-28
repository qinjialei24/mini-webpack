const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default

const getModuleInfo = file => {
  const deps = {}
  const body = fs.readFileSync(file, 'utf-8')
  const ast = parser.parse(body, {
    sourceType: 'module'
  })

  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(file)
      const abspath = './' + path.join(dirname, node.source.value)
      deps[node.source.value] = abspath
    }
  })

  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  return {
    file,
    deps,
    code
  }
}

function createGraph(file) {
  const entry = getModuleInfo(file)
  const temp = [entry]
  const depsGraph = {}
  temp.forEach((item, i) => {
    const deps = item.deps
    if (deps) {
      Reflect.ownKeys(deps).forEach(key => {
        const moduleInfo = getModuleInfo(deps[key])
        if (moduleInfo.deps) {
        }
        temp.push(moduleInfo)
      })
    }
  })

  temp.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    }
  })
  return depsGraph
}


function bundle(entry) {
  const graph = createGraph(entry)
  console.log('graph: ', graph);

}

const content =  bundle('./src/index.js')
