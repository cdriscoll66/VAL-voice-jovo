# Jovo Template: Hello World

This template contains a Jovo Sample Voice App with a simple "Hello World!" greeting, asking for the user's name and returning a personalised message. This is the default template for the `jovo new` command.

## Quick Start

To use the Jovo Templates, you'll need the Jovo CLI. You can install it globally with NPM.

```sh
$ npm install -g jovo-cli
```

After successfully installing the Jovo CLI, you can install the template using one of the following commands:

```sh
$ jovo new <directory>

## Alternative
$ jovo new <directory> --template helloworld
```

> Read more about `jovo new` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-new).

Change your working directory into your newly created project directory and run your voice app:

```sh
# Change working directory to your previously specified directory.
$ cd <directory>

# Install dependencies.
$ npm install

# Run voice app, optionally with a --watch flag to restart on code changes.
$ jovo run [-w]
```

> Read more about `jovo run` [here](https://www.jovo.tech/marketplace/jovo-cli#jovo-run).

If you now go to the [Jovo Debugger](https://www.jovo.tech/marketplace/jovo-plugin-debugger) by pressing `.` or clicking on the webhook url in the terminal, you can test your voice application right away.

![Debugger Example](./img/debugger.gif)

## Next Steps

Now that you got the template running on the Jovo Debugger, it is time to deploy your voice app! You can find a tutorial for building a complete Alexa skill [here](https://www.jovo.tech/tutorials/alexa-skill-tutorial-nodejs).

To see what else you can do with the Jovo Framework, take a look at the [Jovo Documentation](https://www.jovo.tech/docs/).

## About Jovo

Jovo is the most popular development framework for voice, including platforms like Alexa, Google Assistant, mobile apps, and Raspberry Pi.

-   [Jovo Website](https://jovo.tech/)
-   [Documentation](https://jovo.tech/docs/)
-   [Marketplace](https://www.jovo.tech/marketplace/)
-   [Twitter](https://twitter.com/jovotech/)
-   [Forum](https://community.jovo.tech/)



AWS LAMBDA
DEPLOYMENT STEPS. 

How to push the Code up to the DEV LAMBDA. 

To do this you will need an IAM un/pw permissions. 
navigate to : console.aws.amazon.com

account id is 'teamcolab' (and enter your aws IAM un/pw)

From here navigate to Services > Lambda > functions > VALottery Dev skill. 

On your local build - delete your node modules. 

Run "npm run deploy:dev" 

This will build the app for linux. 

once it's complete you compress/zip up the entire file system (do not put it in a subdirectory)

Navigate back to the console.aws.amazon.com and to the panel thats title Function Code. 

Under the 'Actions' dropdown there will be an option to 'Upload a Zip File'

Once successful. Check the app again:
(use the test on the top, or navigate back to the skills kit and run a few tests off the lambda. Make sure you are still not pointing the endpoint at your Jovo Local App. )


Once this skill has been approved from test. start the distribution and certification process. 

if approved it will be pushed to live. 
