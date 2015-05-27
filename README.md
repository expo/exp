# exp
The command-line tool for creating and publishing rich articles written with JavaScript and React Native

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

#### Installing `exp`



### Creating Your First Article

Projects in Exponent are called articles. Let's create your first one!

Go to your home directory by typing `cd` and then type
```bash
exp init myarticle
```

This will create a new directory called `myarticle` and fill it with


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

The easiest way to get help is to sign into our [Slack](https://exponent-developers.slack.com), and ask in the `#help` channel.

If you download the Exponent app, it will ask for your e-mail at signup and a Slack invite will be sent to you automatically.

If you have trouble getting into the Slack or just want a different way to contact us, you can e-mail [exponent.team@gmail.com](mailto:exponent.team@gmail.com).

The GitHub organization is [exponentjs](https://github.com/exponentjs).

And on Twitter, you can reach us at [@exponentjs](https://twitter.com/exponentjs) and [@JI](https://twitter.com/JI) and [@ccheever](https://twitter.com/ccheever).
