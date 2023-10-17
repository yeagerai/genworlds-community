const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js', //entry for the public page
      template: 'public/index.html', // source template
      filename: 'index.html', // output as dist/*
      title: 'GenWorlds Community', // when using template and/or filename options, you may need to specify the title in vue.config.js
    }
  },
})
