import path from 'path';
import { readdirSync, readFileSync } from 'fs'
import { transformFileSync } from '@babel/core';
import expect from 'expect';
import plugin from '../src/index'

const fixturesDir = path.join(__dirname, 'fixtures')
const fixtures = readdirSync(fixturesDir)

fixtures.map(fileName => {
    const currDir = path.join(fixturesDir, fileName)
    const actualFile = path.join(currDir, 'actual.js')
    const expectFile = path.join(currDir, 'expect.js')

    it(`should work with ${fileName}`, () => {
        let pluginWithOpts

        // 按需加载
        if(fileName === 'load-on-demand') {
            pluginWithOpts = [
                plugin, { libraryName: 'test-ui' }
            ]
        }

        // 自动加载css
        if(fileName === 'import-css') {
            pluginWithOpts = [
                plugin, { libraryName: 'test-ui', style: true }
            ]
        }
        
        const actual = function() {
            return transformFileSync(actualFile, {
                presets: ['@babel/preset-react'],
                plugins: [pluginWithOpts]
            }).code
        }
        
        // console.log(actual())
        const excepted = readFileSync(expectFile, 'utf-8')
        expect(actual()).toEqual(excepted)
    })

})