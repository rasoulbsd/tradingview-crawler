# Tradingview Crawler

## Deploying repo to a VPS
We must add the server's ssh-key to the deploy keys of the server. Consider that you must fork the repo to be able to add the deploy key. 
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

Reload the bash or Zsh:
```
source ~/.bashrc
```
Or
```
source ~/.zshrc
```
#### installing node
Now the nvm is installed after that we might install and use the node version we want.
```
nvm install 16
nvm use 16
```

### installing node and npm using nvm

### Repo and packages setup
Before moving forward, make sure you have installed node js and npm on your machine.
Also, consider that there is a need for a VPN for downloading the packages.
Use the command below on the project directory to download and install the required packages:
```
npm install
```
### Requirements for the Puppeteer
There are some requirements to be able to run Puppeteer in headless mode in Debian-based Linux:
```
sudo apt-get install libnss3-dev
```
```
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev
```
#### Note!
If there were problem with downloading chromium (mostly you may encounter error 403 and the reason if the IP of the server is black-listed by google), you should follow these steps:

```
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer
```
It might fix the problem and you can enter "npm install" again but if there was a problem, enter this and try again:
```
npm cache clean --force
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer
```
**Download Chrome Manually**
* https://download-chromium.appspot.com/
* https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html

**Example:**
```
wget https://commondatastorage.googleapis.com/chromium-browser-snapshots/Linux_x64/1177026/chrome-linux.zip
unzip chrome-linux.zip
```
edit this in **"/helpers/initial.js"**:
```
const browser = await puppeteer.launch({
    executablePath: 'path/to/your/chrome.exe'
});
```

## Running the server
The easy-to-use method for testing the server is to create a screen and run the server in it:
### Install the screen
```
sudo apt-get install screen
```
### Create the screen
```
screen -S <screen-name>
```
**Example:** "screen -S API"

### Running the server
Now go to the project directory and run the server:
```
npm run server
```
**Note:** The default port is 80. If want to run on another port, for now, edit the "src/app.js"

### Screen Commands
#### list screens in a machine:
```
screen -ls
```
#### Resume a screen:
```
screen -r <screen-name>
```
#### Detach from a screen:
```
ctrl+a d
```

## APIs
### Creating Account in Tradingview
Use the command below to start creating a Tradingview account on your local machine:
```
npm run tv:create_account
```
#### Note:
1. Be aware that it must be run on a local machine because you may face `reCaptcha` during account creation and you should have a graphic user interface and the code can not be run headless. Also consider that when you see the reCapthca button, you have 60sec to solve that but it is recommended to solve it under 30sec, then you must click on the submit button under that.

2. Because it is running locally, you may encounter network errors based on your network status. In that case, the problem should be solved by retrying or changing the network or VPN based on your situation.

#### Functionalities
There are several functions you can use with `npm`:
* Create email in Cpanel
* exporting account history
* Create account in Tradingview
* log in to a Tradingview account
* set prop in paper trading in Tradingview for an existing account
