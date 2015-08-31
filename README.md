# [DEPRECATED] exp [![Slack](http://slack.exponentjs.com/badge.svg)](http://slack.exponentjs.com)

`exp` has been superseded by an app called `xde`: [`https://github.com/exponentjs/xde`](https://github.com/exponentjs/xde).

We recommend that you use xde instead of exp. We're going to put most of our development effort into xde going forward, and we believe it's already easier to use and more reliable than exp.

# Quick Start

Download Exponent onto your phone at http://exp.host/

Install the latest `iojs` if you don't have it yet. We recommend using [`nvm`](https://github.com/creationix/nvm)

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.3/install.sh | bash
nvm install iojs
nvm alias default iojs
# (now open a new terminal window)
```

Now install `exp` and use it to create your first article.

```bash
npm install -g exp
mkdir myfirstarticle
cd myfirstarticle
exp init
# Hit enter a bunch of times to use the default for each question
exp start
```

If you give your phone number here, a link will be texted to your phone. If you follow it, you should see a green background and a photo of a duckling and some text.

Try editing some of the code in `index.js` and then hitting the reload button in Exponent. If everything is working, you should see your changes!

# Getting Started (in a little more detail)

### Installing the Exponent app on your Phone

If you don't already have the Exponent app, get it from http://exp.host/. Tap the `Download` button, and then choose the `Install` option when you see the modal dialog popping up that tells you that dl.dropboxusercontent.com wants to install "Exponent Beta".

This will start the app downloading on your home screen, but you'll otherwise get no confirmation that it is working. Tap your home button to get to your home screen and look for the Exponent Beta app; the logo is a bold, white caret (^) on a dark blue background.

### Installing the `exp` command line tool

Currently, `exp` has only been extensively tested on a Mac. If you are running Windows, you can track progress on making it work on Windows [here]( https://github.com/exponentjs/exp/issues/1). If you are using Linux or similar, it will probably work but file a GitHub issue if you have any problems.

#### Installing `nvm`

Even if you already have some version of `node` or `iojs` installed, we recommend using `nvm` to manage your `node` binaries. It will let you switch between different versions easily, upgrade to the latest versions of node/iojs easily, will make it so you don't need to use `sudo` to globally install modules, and will usually be able to set up your `$PATH` environment variable correctly so you can run the scripts of globally installed modules easily.

You can install `nvm` here: https://github.com/creationix/nvm

Or just type this into your terminal:
```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.3/install.sh | bash
```

Once `nvm` is installed, you should install the latest version of `iojs` and make the default. You can do this by pasting the following snippet into to your terminal.

```bash
nvm install iojs
nvm alias default iojs
# (Open a new terminal window)
```

When you open the new terminal window, typing `node -v` should show you a version number that matches the latest version of node/iojs.

#### Installing `exp`

Once you have the latest version of iojs/node in place, install `exp` globally.

```bash
npm install -g exp
```

You can verify that the installation worked by typing `exp

### Creating Your First Article

Projects in Exponent are called articles. Let's create your first one!

Go to your home directory by typing `cd` and then type
```bash
exp init myarticle
```

This will create a new directory called `myarticle` and fill it with a `package.json` describing your article and its dependencies, etc., and an `index.js` which contains code for a basic sample article.

### Viewing Your Article on Your Phone

Now that you've done the basic setup, it's time to view your article on your phone!

Type the command
```bash
exp start
```
into your terminal.

This will start serving your article in a way that should be accessible by the Exponent app on your phone.

What happens when you run `exp start` is that exp spawns the React Native packager as a daemon process managed by pm2. This will keep running until you run `exp stop` or restart your computer. It also starts an ngrok server that will tunnel the packager's output to the Internet-at-large so that Exponent onyour phone can access it, even if it isn't using your LAN wifi.

#### If your phone is connected to your LAN Wi-fi, you can skip going through ngrok

The command `exp url` has many options and is useful.

Try
```bash
exp url --lan
```

This will give you a LAN URL that doesn't go through ngrok, which can be a lot snappier, especially if you have slow Internet or are far away from ngrok's proxies.

### Viewing Your Article in the Simulator (Experimental)

If you have Xcode and the iOS Simulator on your phone, then you can view your Exponent projects in the simulator. This is sometimes nice because switching windows is easier than switching over to looking at your phone sometimes.

Run the command
```bash
exp start-simulator
```

You'll be presented with a choice of simulators. For now, the only one that works is the iPhone 6 simulator, so choose that.

The Exponent app will start up in your simulator if everything is working right.

Back at your terminal, run the command
```bash
exp open
```

This will open URL for your project in the Exponent app in the simulator. You need to have started it up with `exp start-simulator` but once you've done that, you can do `exp open` on different articles multiple times.

There are still some kinks with this functionlaity so it should be considered beta.

### Using Exponent with an existing React Native Project

You can also use Exponent with an existing React Native project.

First, make sure your application key is `'main'`.

#### You have to set your application key to `'main'`

For now, your application key (which is set by the line in your JavaScript that looks like this:
  ```js
  AppRegistry.registerComponent('main', () => ExampleApp);
  ```
  )
needs to specify `'main'` as the key. You may have to make a slight modification to your code for this. We are [planning to make it so you can configure the application key](https://github.com/exponentjs/exp/issues/2) but for now, you have to use `'main'`.

Now, there are two ways you can serve your application in a way that Exponent clients can reach it: using `exp` or by using `ngrok` with your existing infrastructure.

#### Using `exp`

Just go into the root directory of where your react code is, and run `exp start`. You'll get a URL that you can send to yourself or others the way that you normally do.

#### Using `ngrok`

First, install `ngrok`. You can [download it from the ngrok website](https://ngrok.com/download) or use `brew` to install it if you have homebrew (`brew install ngrok`).

Run `npm start` the way you normally would with your React Native project.

Now the packager is running on port 8081, but it is (probably) only accessible within your LAN, so we need to tunnel out to the larger Internet, and that's what `ngrok` is for.

Run
```bash
ngrok 8081
```
This will show you a URL on your screen that you can use to access port 8081 on your local machine through http or https. The URL will look something like `https://c978db3.ngrok.com`.

On your phone, type in that URL to the Exponent address bar, replacing "http://" or "https://" with "exp://".


#### Custom Native Modules Don't Work With Exponent Right Now

Unfortunately, Exponent won't work with custom native modules. The app on your phone is only built with certain modules included, and if your own React Native app uses custom native modules you wrote, those won't be available inside Exponent.

If you have specific native modules that would be really useful to you, let us know (you can chat with us in our Slack, @mention us on Twitter, [e-mail us](mailto:exponent.team@gmail.com), or file a GitHub issue.)

We want to add in native modules to address all the common desires people have for native functionality (camera access, GPS, etc., etc.), so help us figure out what should be in Exponent!


## Getting Help & Contacting the Developers

The easiest way to get help is to sign into our [Slack](http://exp.host/community), and ask in the `#help` channel.

If you download the Exponent app, it will ask for your e-mail at signup and a Slack invite will be sent to you automatically.

If you have trouble getting into the Slack or just want a different way to contact us, you can e-mail [exponent.team@gmail.com](mailto:exponent.team@gmail.com).

The GitHub organization is [exponentjs](https://github.com/exponentjs).

And on Twitter, you can reach us at [@exponentjs](https://twitter.com/exponentjs) and [@JI](https://twitter.com/JI) and [@ccheever](https://twitter.com/ccheever).
