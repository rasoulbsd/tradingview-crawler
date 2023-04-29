# Tradingview Crawler

## Setup
Before moving forward, make sure you have installed node js and npm on you machine.
Also consider that there might be need of VPN for downloading the packages.
Use the command bellow on the project directory to download and install required packages:
```
npm install
```

## Creating Account in tradingview
Use the command below to start creating tradingview account in your local machine:
```
npm run tv:create_account
```
### Note:
1. Be aware that it must be run in local machine because you may face `reCaptcha` during account creation and you should have a graphic user interface and the code can not be run headless. Also consider that when you see the reCapthca button, you have 60sec to solve that but it is recommended to solve it under 30sec, then you must click on the submit button under that.

2. Because it is running locally, you may encounter network errors based on your network status. In that case, the problem should be solved with retrying, changing network or changing VPN based on your situation.

## Functionalites
There are several functions you can use with `npm`:
* create email in cpanel
* exporting account history
* create account in tradingview
* login to an tradingview account
* set prop in paper trading in tradingview for an exising account
