[![Codeship Status for devialab/plusuni-app](https://codeship.com/projects/codeship_hash/status?branch=master)](https://codeship.com/projects/codeship_id)

# Project Management

* [CI](https://codeship.com/projects/codeship_id)
* [GIT](https://bitbucket.org/devialab/app-name)
* [Basecamp](https://3.basecamp.com/basecamp_id/projects)
* [Kanban](https://tree.taiga.io/project/app-name/backlog)
* [Chat](https://devialab.slack.com/messages/app-name/)
* [API](http://docs.app-name.apiary.io/#reference)
* [Locales](https://webtranslateit.com/en/projects/webtranslateit_id-CACT)
* [GoogleCloud](https://console.cloud.google.com/home/dashboard?project=app-name&pli=1)
* [FacebookApp](https://developers.facebook.com/apps/facebook_app_id/settings/basic/)


# Ionic View

* AppId: `*****`


# Dependencies

* Ruby
* NodeJS


# Installation

```
npm run install:deps
npm install --force
npm start
```


# Build project

```
npm build
```


# Set environment config

Build/run project with specific environment config.

Supported values: `int` `prod`

```
npm build --env int
```


## Test

* Run on browser

	```
	ionic serve --lab
	```

* Run on device

	* USB connected android 
	
		```
		ionic run android
		```

* Run on emulator

	* Android

		```
		ionic emulate android
		```

	* IOS

		```
		ionic emulate ios
		```


* Unit test

	```
	npm test
	```


# Locales

Download latest locales from [webtranslateit.com](https://webtranslateit.com)

```
gulp locales
```


# [Release](https://github.com/acierto/gulp-release)

```
gulp release [--minor|--mayor]
```


## Authors

Made with :heart: by [devialab](http://devialab.com) team
