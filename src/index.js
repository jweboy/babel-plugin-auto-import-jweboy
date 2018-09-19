import fsPath from 'path'
import { addSideEffect } from '@babel/helper-module-imports'
import Plugin from './plugin'

function formatPath(path) {
    return path.replace(/\\/g, '/')
}

export default function({ types }) {
    const libDir = 'lib'
    const specified = Object.create(null)
    // const program = {
    //     enter(path, { opts = {}}) {
    //         // console.log(path)
    //         // if (Array.isArray(opts)) {
    //         //     opts.map(({ libraryName }) =>{
    //         //         console.log(libraryName, 'libraryName should be provided')
    //         //         // asset(libraryName, 'libraryName should be provided')
    //         //         return new Plugin({
    //         //             libraryName
    //         //         })
    //         //     })
    //         // } else {
    //         //     new Plugin({
    //         //         libraryName: opts.libraryName
    //         //     })
    //         // }
    //     }
    // }
    function importMethod(name, file, { style, libraryName }) {
        const path = formatPath(fsPath.join(libraryName, libDir, name))
        if (style === true) {
            addSideEffect(file.path, `${path}/style`)
        }
        if(style === 'css') {
            addSideEffect(file.path, `${path}/style/css`)
        }
    }

    const result = {
        visitor: { 
            // program,
            ImportDeclaration: function(path, { opts }) {
                const { node } = path
    
                // path可能被移除
                if(!node) return
            
                const { specifiers, source } = node

                if(opts.libraryName === source.value &&!types.isImportDefaultSpecifier(specifiers[0])) {
                    const declarations = specifiers.map((specifier) => {
                        const { local, imported } = specifier
                        specified[local.name] = imported.name
                        
                        // 创建ImportDeclaration节点
                        return types.ImportDeclaration( 
                            [types.importDefaultSpecifier(specifier.local)],
                            types.stringLiteral(`${source.value}/lib/${specifier.local.name}`)
                        )
                    })
            
                    path.replaceWithMultiple(declarations)
                }
            },
            CallExpression(path, { opts }) {
                const { node } = path
                const file = path.hub && path.hub.file
                
                if(!node) return 

                const args = node.arguments
                const { name } = node.callee

                if(types.isIdentifier(node.callee)) {
                    if(!!specified[name]) {
                        importMethod(name, file, opts)
                    }
                }

                args.map((arg) => {
                    const { name } = arg
                    if(!!specified[name]) {
                        importMethod(name, file, opts)
                    }
                })

            }
        },
    }

    return result
}