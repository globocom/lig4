# lig4
Lig4 is a board game brought to the web

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/globocom/lig4/tree/master)


# Running Workers

```
$ make worker
```

# Runnning Web Server

```
$ make run
```

# Settings must be set in environment

```
NODE_ENV=development
PORT=9999

# Mongo DataBase endpoint
#DBAAS_MONGODB_ENDPOINT="mongodb://localhost:27017"
SESSION_SECRET=secret

#github client ID and client secret
#GITHUB_ID=
#GITHUB_SECRET=
```
