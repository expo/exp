child_process = require 'child_process'
co = require 'co'
crayon = require '@ccheever/crayon'
instapromise = require 'instapromise'
minimist = require 'minimist'
ngrok = require 'ngrok'
path = require 'path'

module.exports = (command, argv) ->
  """Runs the given command"""
  switch command
    when 'start', undefined
      co ->
        ngrokSubdomain = argv['ngrok-subdomain']
        ngrokAuthToken = argv['ngrok-auth-token']
        { port } = argv
        port ?= 9000 + Math.floor(Math.random() * 1000)
        # TODO: Put in some kind of retry logic in case we pick a random port that is already taken
        urlP = ngrok.promise.connect { port, authtoken: ngrokAuthToken, subdomain: ngrokSubdomain }

        # TODO: Consider using react-packager directly instead of invoking this through a child_process
        # TODO: Try out using some sort of hot reloading/webpack solution like this one:
        # https://github.com/mjohnston/react-native-webpack-server
        pp =  path.join __dirname, './node_modules/react-native/packager/packager.sh'
        packager = child_process.spawn pp, ["--port=#{ port }"], {
          stdio: [process.stdin, process.stdout, process.stderr]
        }

        [url] = yield [urlP]

        crayon.log """
        Started packager and ngrok
        Your URL is
        #{ crayon.bold url }

        """

    else
      console.error "The only command that works right now is `start`"

if require.main is module
  argv = minimist process.argv.slice 2
  module.exports argv._[0], argv
