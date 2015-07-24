BOURBON=node_modules/bourbon/app/assets/stylesheets
HTML_MINIFIER=node_modules/html-minifier/cli.js
IMAGEMIN=node_modules/imagemin/cli.js
MUSTACHE=node_modules/mu2/bin/mu
SASS=node_modules/node-sass/bin/node-sass
VIGILIA=node_modules/vigilia/bin/vigilia
WEBPACK=node_modules/webpack/bin/webpack.js
MOCHA=node_modules/mocha/bin/mocha

.SILENT:

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
	$(HTML_MINIFIER) --collapse-whitespace --output public/app.html --remove-comments app.html

tree:
	mkdir -p public/images
	mkdir -p public/scripts
	mkdir -p public/styles

watch: build
	$(VIGILIA) 'images/**/*':'make images' 'scripts/**/*.js':'make scripts' 'styles/**/*.scss':'make styles' 'templates/**/*.html':'make templates'

tests:
	$(MOCHA)