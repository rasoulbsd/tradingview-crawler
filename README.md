# Tradingview Crawler

## Deploying repo to a VPS
We must add the server's ssh-key to the deploy keys of the server. Consider that you must fork the repo in order to be able to add the deploy key. 
When creating the deploy key for the repo, make sure to check the "write access" checkbox.
After adding the deploy key, you can clone the repo by the ssh method.

## Server Setup
You must have npm and node installed on the machine. It is very much preferred to use nvm and install node version 16.

### installing node and npm using nvm
Please see the following link for installing the latest nvm (for now we are installing v0.39.4): 
https://github.com/nvm-sh/nvm

#### installing nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```
Or
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```
Then
```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
#### installing node
Now the nvm is installed after that we might install and use the node version we want.
```
nvm install 16
nvm use 16
```

## Setup
Before moving forward, make sure you have installed node js and npm on your machine.
Also, consider that there is a need for a VPN for downloading the packages.
Use the command below on the project directory to download and install the required packages:
```
npm install
```

## Creating Account in Tradingview
Use the command below to start creating a Tradingview account on your local machine:
```
npm run tv:create_account
```
### Note:
1. Be aware that it must be run on a local machine because you may face `reCaptcha` during account creation and you should have a graphic user interface and the code can not be run headless. Also consider that when you see the reCapthca button, you have 60sec to solve that but it is recommended to solve it under 30sec, then you must click on the submit button under that.

2. Because it is running locally, you may encounter network errors based on your network status. In that case, the problem should be solved by retrying or changing the network or VPN based on your situation.

## Functionalities
There are several functions you can use with `npm`:
* Create email in Cpanel
* exporting account history
* Create account in Tradingview
* log in to an Tradingview account
* set prop in paper trading in Tradingview for an existing account
