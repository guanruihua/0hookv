import path from 'path'
import rollupTypescript from 'rollup-plugin-typescript2'
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import vue from 'rollup-plugin-vue'

const Name = '0hookv'

const paths = {
  input: 'src/index.tsx',
  output: 'lib'
}

// rollup 配置项
const rollupConfig = [{
  input: paths.input,
  output: [
    // 输出 commonjs 规范的代码
    {
      file: path.join(paths.output, 'index.js'),
      format: 'cjs',
      name: Name,
      sourcemap: true
    },
    // 输出 es 规范的代码
    {
      file: path.join(paths.output, 'index.esm.js'),
      format: 'esm',
      name: Name,
      sourcemap: true
    }
  ],
  external: ['vue', 'abandonjs', 'asura-eye', 'dayjs'],
  plugins: [
    vue(),
    peerDepsExternal({
      includeDependencies: true,
    }),

    // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
    commonjs(),

    // 配合 commnjs 解析第三方模块
    resolve({
      // 将自定义选项传递给解析插件
      customResolveOptions: {
        moduleDirectories: ['node_modules']
      }
    }),
    rollupTypescript(),
    babel({
      runtimeHelpers: true,
      // 只转换源代码，不运行外部依赖
      exclude: 'node_modules/**',
      // tsconfig: '../tsconfig.npm.json',
      include: '../src',
      // moduleResolution: 'NodeNext',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts']
    }),
    terser()

  ]
}, 
]

export default rollupConfig
