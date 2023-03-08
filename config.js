const config = {
    appConfig: {
        host: process.env.APP_HOST || "http://localhost:3000",
        port : process.env.PORT || 3000,
    }
}

module.exports = config;