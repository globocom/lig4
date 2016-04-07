
function env() {

	process.env.NODE_ENV = 'test';
	process.env.PORT = 6666;
	process.env.DBAAS_MONGODB_ENDPOINT = 'mongodb://localhost:27017/test-lig4-api2';
	process.env.SESSION_SECRET = 'dummy';
	process.env.GITHUB_ID = 'dummy';
	process.env.GITHUB_SECRET = 'dummy';

}

module.exports.setEnv = env;
