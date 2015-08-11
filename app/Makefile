NODE=node
MOCHA=node_modules/mocha/bin/mocha
KARMA=node_modules/karma/bin/karma
BOURBON=node_modules/bourbon/app/assets/stylesheets
SASS=node_modules/node-sass/bin/node-sass
VIGILIA=node_modules/vigilia/bin/vigilia
WEBPACK=node_modules/webpack/bin/webpack.js

.SILENT:

.PHONY: run test clean-client scripts-client styles-client watch-client test-client

# app tasks

test:
	$(MOCHA)

run: build-client
	$(NODE) app.js

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
	$(WEBPACK) --bail -p client/scripts/main.js public/scripts/main.js > /dev/null

styles-client: tree-client
	$(SASS) --include-path $(BOURBON) --output public/styles --output-style compressed --quiet client/styles/main.scss public/styles/main.css

test-client:
	$(KARMA) start client/test/config.js
