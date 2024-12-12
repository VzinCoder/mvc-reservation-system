const NODE_ENV = {
    PRODUCTION:'production',
    DEVELOPMENT:'development'
}

const isProd = () => {
    const env = process.env.NODE_ENV
    if(env !== NODE_ENV.PRODUCTION && env !== NODE_ENV.DEVELOPMENT ){
        throw new Error('error to load NODE_ENV')
    }
    return process.env.NODE_ENV !== NODE_ENV.DEVELOPMENT
}


module.exports = {
    isProd,NODE_ENV
} 