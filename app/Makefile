BOURBON=node_modules/bourbon/app/assets/stylesheets
HTML_MINIFIER=node_modules/html-minifier/cli.js
IMAGEMIN=node_modules/imagemin/cli.js
MUSTACHE=node_modules/mu2/bin/mu
SASS=node_modules/node-sass/bin/node-sass
VIGILIA=node_modules/vigilia/bin/vigilia
WEBPACK=node_modules/webpack/bin/webpack.js
KARMA=node_modules/karma/bin/karma

.SILENT:

.PHONY: test watch clean images scripts styles templates tree

build: images scripts styles templates

clean:
	rm -fr public
	rm -f npm-debug.log

images: tree
	$(IMAGEMIN) images public/images

scripts: tree
	$(WEBPACK) --bail -p scripts/main.js public/scripts/main.js > /dev/null

styles: tree
	$(SASS) --include-path $(BOURBON) --output public/styles --output-style compressed --quiet styles/main.scss public/styles/main.css

templates: tree
	$(MUSTACHE) --view "`cat package.json`" --root templates app.html > public/app.html
	$(HTML_MINIFIER) --collapse-whitespace --output public/app.html --remove-comments public/app.html

tree:
	mkdir -p public/images
	mkdir -p public/scripts
	mkdir -p public/styles

watch: build
	$(VIGILIA) 'images/**/*':'make images' 'scripts/**/*.js':'make scripts' 'styles/**/*.scss':'make styles' 'templates/**/*.html':'make templates'

test:
	$(KARMA) start test/config.js
