LeaderboardCI
=============

Leader board for teamcity based on Siren of shame.

When a build succeeds you get 1 point when a build fails you lose 4 points.

Streaks
=======

When you reached x number of successful builds in a row you achieve badges:
if you want to add achievements just edit the Accomplishments.js file in the lib folder

Requirements
============
-Redis database
-Node.js
-teamcity
-webhooks plugin for teamcity
Installation
============
- Change the default.json.example in the config folder according to your configuration and rename it to default.json

- run following command 'npm install' all dependencies will be installed.

- deploy to heroku (https://devcenter.heroku.com/articles/getting-started-with-nodejs)

- install webhooks plugin in teamcity (http://sourceforge.net/apps/trac/tcplugins/wiki/TcWebHooks)

- configure webhooks in project settings with following settings:
	- url: the url to your heroku app
	- On completion: trigger when build is Successfull, trigger when build fails
	- payload format: Json
	- Builds check all

Screenshots
===========
![Alt text](/screenshots/screen.png?raw=true)



