[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/CloudDoorThesis/badge.svg?targetFile=/poc/gcp/CloudDoorRegistrationFunction/package.json)](https://snyk.io/test/github/kamiljano/CloudDoorThesis)

# About

The project contains a POC for the Google Cloud Platform based CnC approach.

# Things to consider

## Backend logic

Google Cloud Platform offers a number of different approaches to implement the backend logic.
Some of them are Virtual Machine based, where the developer is free to decide what applications 
(servers/standalone applications which can be framework independent) should be run, down to the 
smallest detail. However it is also possible to create an entirely serverless solution, which at least
in theory should be just as performant, easier and faster to implement, easier to monitor, while lowering
the cost of execution. That however can come for a price of becoming Cloud Platform/Technology-dependant. 

### Server based

* Compute Engine - high performance scallable VMs

### Serverless 

// TODO: monitoring

## IoT service

### Authentication

## Pub/Sub

### Authentication

# POC implementation