[![Build Status](https://travis-ci.org/kamiljano/CloudDoorThesis.svg?branch=master)](https://travis-ci.org/kamiljano/CloudDoorThesis)
[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/CloudDoorThesis/badge.svg?targetFile=/poc/standalone/CloudDoorServer/package.json)](https://snyk.io/test/github/kamiljano/CloudDoorThesis)
[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/CloudDoorThesis/badge.svg?targetFile=/poc/standalone/CloudDoorClient/package.json)](https://snyk.io/test/github/kamiljano/CloudDoorThesis)

# About

The module contains standalone CnC, the client that can connect to it and an admin application
that can send the requests to the CnC.


![Standalone standalone architecture](../../architecture/standaloneArchitectureScaled.png "Standalone scalable architecture")

Moreover, the e2e directory contains a small test that

1. starts up a server
2. starts up a client 
3. Makes sure that the communication works as planned