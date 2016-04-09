# lig4
Lig4 is a board game brought to the web by globo.com. Made to be part of it's presence at the Braziljs conference, challenging attendees to write an algorithm  which would fight against other attendees code.

We made this small tournament at the 2015 Braziljs  conference and also at the 2015 TDC Porto Alegre.
Each winner got a Kindle Paperwhite prize.

During both conferences and later discussions, we were asked to release a permament tournament(we are working on that) and open source our code.


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/globocom/lig4/tree/master)

# Requirements

* nodejs >4.x with working npm
* MongoDB


# Install (or just deploy to heroku)

After cloning this repo and making sure you have the requirements installed

```
$ npm install
```

Most `make` commands are very straighforward, all needed tasks should be there. Fill a bug if you find something

Take a look at the end of this readme, there is a few env vars your should set before running the webserver or the worker.

Everything setup, you can now workers(they take care of ranking and running the code fights) and or webserver.


# Running Workers

```
$ make worker
```

# Runnning Web Server

```
$ make run
```

# Environment vars to be set

```
NODE_ENV=development (dev only)
PORT=9999 (dev only)

# mongodb endpoint

MONGOLAB_URI="mongodb://localhost:27017"  (dev only)
SESSION_SECRET=secret

#github client ID and client secret

GITHUB_ID=
GITHUB_SECRET=
```
