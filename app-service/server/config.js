const env = process.env;

const config = {
    uploadPath: env.UPLOAD_PATH || `${__dirname}\\uploads`,
    secret: env.SECRET || 'secret'
};


module.exports = config;