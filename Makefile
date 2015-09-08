NODE=node
MOCHA=node_modules/mocha/bin/mocha
KARMA=node_modules/karma/bin/karma
BOURBON=node_modules/bourbon/app/assets/stylesheets
SASS=node_modules/node-sass/bin/node-sass
VIGILIA=node_modules/vigilia/bin/vigilia
WEBPACK=node_modules/webpack/bin/webpack.js
PM2=node_modules/pm2/bin/pm2
GIT=git

.PHONY: run stop logs monit test worker runner scheduler tsuru-publish clean-client scripts-client styles-client watch-client test-client

# tsuru tasks

tsuru-publish: build-client
	$(GIT) push tsuru-git@git.tsuru.globoi.com:lig4.git

# scheduler & runner tasks

worker: scheduler runner

scheduler:
	$(NODE) scheduler.js

uplead:
	$(NODE) uplead.js

runner:
	$(NODE) runner.js --use_strict

# app tasks

test:
	$(MOCHA)

run: build-client
	$(PM2)-dev start config/dev.json

stop:
	$(PM2) delete config/dev.json

# client tasks

build-client: clean-client scripts-client styles-client images-client

watch-client: build-client
	$(VIGILIA) 'client/scripts/**/*.js':'make scripts-client-dev' 'client/styles/**/*.scss':'make styles-client'

clean-client:
	rm -fr public
	rm -f npm-debug.log

images-client:
	cp client/images/thumbnail.png public/thumbnail.png

tree-client:
	mkdir -p public/scripts
	mkdir -p public/styles

scripts-client: tree-client
	$(WEBPACK) --bail -p client/scripts/main.js public/scripts/main.js
	$(WEBPACK) --bail -p client/scripts/playground.js public/scripts/playground.js

scripts-client-dev: tree-client
	$(WEBPACK) --bail client/scripts/main.js public/scripts/main.js
	$(WEBPACK) --bail client/scripts/playground.js public/scripts/playground.js

styles-client: tree-client
	$(SASS) --include-path $(BOURBON) --output public/styles --output-style compressed --quiet client/styles/main.scss public/styles/main.css
	$(SASS) --include-path $(BOURBON) --output public/styles --output-style compressed --quiet client/styles/playground.scss public/styles/playground.css

test-client:
	$(KARMA) start client/test/config.js
