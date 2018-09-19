// import babel from '@babel/core'
import types from '@babel/types'

// const exampleCode = `import { Button, Modal, Table, Badge } from 'jl-ui'`

export default class Plugin {
    ImportDeclaration(path, { opts }) {
        const { node } = path
    
        // path可能被移除
        if(!node) return
    
        const { specifiers, source } = node

        console.log(opts, source);
    
        if(opts.libraryName === source.value &&!types.isImportDefaultSpecifier(specifiers[0])) {
            const declarations = specifiers.map((specifier, index) => {
                // 创建ImportDeclaration节点
                return types.ImportDeclaration( 
                    [types.importDefaultSpecifier(specifier.local)],
                    types.stringLiteral(`${source.value}/lib/${specifier.local.name}`)
                )
            })
    
            path.replaceWithMultiple(declarations)
        }
    }
}

// const result = babel.transform(exampleCode, {
//     plugins: [{ visitor }]
// })
// console.log(result.code);
// module.exports = function() {
//     return { visitor }
// }