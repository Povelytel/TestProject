const params = require("./package.json");
module.exports = {
    apps: [{
        script: params.main,
        name: params.name,
        env: {
            NODE_ENV: "prod",
            HOST: "0.0.0.0",
            PORT: "3040"
        },
        env_dev: {
            NODE_ENV: "dev",
            HOST: "0.0.0.0",
            PORT: "3040"
        },
        env_test: {
            NODE_ENV: "test",
            HOST: "127.0.0.1",
            PORT: "30265"
        },
        watch: false
    }, {}],
};
