# How `exp` works

At a high level, what `exp` does is package all your JavaScript code up into a bundle and then make it available for download on the Internet, so the Exponent client can load it.

The major pieces of `exp` are:
* The *command line tool* which wraps and controls everything. All of this code is in the `exp` package itself, for the most part.
* The *packager*, which is right now basically just the React Native packager that Facebook provides in the `facebook/react-native` package.
* `pm2` which is a process manager for Node often used to manage production systems, but used here to manage daemons that serve your code.
* `ngrok` which is a tool and service that lets you tunnel servers running on your local machine to the wider Internet.

## The `exp` command line

Everything

## The packager

The code for the packager is in the directory `$EXP/node_modules/react-native/packager`. This is same packager that you would use if you follow the Rect Native tutorial that Facebook publishes.

It basically

## `pm2`

## `ngrok`
