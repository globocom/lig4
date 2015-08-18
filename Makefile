NODE=node
MOCHA=node_modules/mocha/bin/mocha
KARMA=node_modules/karma/bin/karma
BOURBON=node_modules/bourbon/app/assets/stylesheets
SASS=node_modules/node-sass/bin/node-sass
VIGILIA=node_modules/vigilia/bin/vigilia
WEBPACK=node_modules/webpack/bin/webpack.js
PM2=node_modules/pm2/bin/pm2
GIT=git

.PHONY: run stop logs monit test runner scheduler tsuru-publish clean-client scripts-client styles-client watch-client test-client

# tsuru tasks

tsuru-publish: build-client
	$(GIT) push tsuru-git@git.tsuru.globoi.com:lig4.git

# scheduler & runner tasks

scheduler:
	$(NODE) scheduler.js

runner:
	$(NODE) runner.js

# app tasks

test:
	$(MOCHA)

run: build-client
	$(PM2) start config/dev.json

run-dev:
	NODE_ENV=development PORT=9999 DBAAS_MONGODB_ENDPOINT=mongodb://localhost:27017/dev-lig4-api SESSION_SECRET=dummy GITHUB_ID=bc33392c8cafa28733ad GITHUB_SECRET=30ddb4561426c4bb4448a522039a2c58cf0c0d2b $(NODE) app.js

logs:
	$(PM2) logs config/dev.json

monit:
	$(PM2) monit config/dev.json

stop:
	$(PM2) delete config/dev.json

# client tasks

build-client: clean-client scripts-client styles-client

watch-client: build-client
	$(VIGILIA) 'client/scripts/**/*.js':'make scripts-client' 'client/styles/**/*.scss':'make styles-client'

clean-client:
	rm -fr public
	rm -f npm-debug.log

tree-client:
	mkdir -p public/scripts
	mkdir -p public/styles

scripts-client: tree-client
	$(WEBPACK) --bail -p client/scripts/main.js public/scripts/main.js
	$(WEBPACK) --bail -p client/scripts/playground.js public/scripts/playground.js

styles-client: tree-client
	$(SASS) --include-path $(BOURBON) --output public/styles --output-style compressed --quiet client/styles/main.scss public/styles/main.css
	$(SASS) --include-path $(BOURBON) --output public/styles --output-style compressed --quiet client/styles/playground.scss public/styles/playground.css

test-client:
	$(KARMA) start client/test/config.js
