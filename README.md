# DOCBAY

**Docbay is the secure solution that lets you easily write and share documents with people you trust.**

[![Coverage Status](https://coveralls.io/repos/github/andela-dowoade/Docbay/badge.svg?branch=develop)](https://coveralls.io/github/andela-dowoade/Docbay?branch=develop)

[![codecov.io](https://codecov.io/github/andela-dowoade/Docbay/coverage.svg?branch=develop)](https://codecov.io/github/andela-dowoade/Docbay?branch=develop)

[![Build Status](https://semaphoreci.com/api/v1/andela-dowoade/docbay/branches/develop/badge.svg)](https://semaphoreci.com/andela-dowoade/docbay)

The system manages documents, users and user roles. Each document defines access rights; the document defines which roles can access it. Also, each document specifies the date it was published. Users are categorized by roles. Each user must have a role defined for them.

## Installation
Open up your Terminal and clone this repo or download it to your machine:
```bash
$ git clone https://github.com/andela-dowoade/docbay.git
```
####Requirements
The application requires [**node.js**](http://node.org) and [**mongodb**](http://mongodb.org)

#### Dependencies
Install the application dependencies by running the command below in the applications root directory:

```bash
$ npm install
```

Test dependencies:
If you intend run test, it is required you install Jasmine and run Jasmine init in the applications root folder

```bash
$ npm install -g jasmine
...
$ jasmine init
```

## Usage

From the command line run the commands below,
and point your browser/postman at [http://localhost:3000](http://localhost:3000):

```
$ mongodb
...
$ npm run-script launch
```
---

## Testing
To run the tests, use the command below.

```bash
$ mongodb
...
$ npm test
```

## HOSTING
The application is hosted <a href='https://docbay.herokuapp.com/'> here</a>

Enjoy!