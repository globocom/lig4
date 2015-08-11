MOCHA=node_modules/mocha/bin/mocha
PM2DEV=node_modules/pm2/bin/pm2-dev
NODE=node

.SILENT:

.PHONY: run run-dev test

test:
	$(MOCHA)

run:
	$(NODE) api.js

run-dev:
	$(PM2DEV) start api.js
