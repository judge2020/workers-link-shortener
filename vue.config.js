module.exports = {
    publicPath: '/',
    outputDir: 'outfrontend',
    runtimeCompiler: true,
    css: {
        sourceMap: true,
    },
    configureWebpack: {
        optimization: {
            minimize: true,
        },
    }
};
