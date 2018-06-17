# About

The following repository contains Kamil Janowski's master degree thesis, focusing on comparison of architecture
of Command & Control (CnC) servers on various platforms. The goal of the comparison is to find the most efficient
and cost effective method to remotely control the malware.

To simplify the project, increase the development speed and ensure portability of common modules,
both server side as well as the client side code of the Prove of Concept will be written
with the help of Node.js. In real life applications however at least the client side
should be written in a lower level language, to lower the risk of detection by the antivirus software.

# Use cases

// TODO: compare the most common trends for malware behaviour. Crypto mining? Surveillance? Password theft?

# Approaches that will be reviewed in the study

//TODO: modularize README. The main page should only contain a small description of what is going on
and the details of each approach should be described only in POC modules.

## Standalone CnC

The most basic solution suggested by various blogs is a single standalone CnC server.

![Standalone architecture](architecture/standaloneArchitecture.png "Standalone architecture")

//TODO: add sequence diagram 

## Scalable standalone CnC

The previous solution has serious limitations in terms of performance. With larger number of clients, a single
Virtual Machine running the server might not have enough resources to run the system efficiently
(especially when it comes network capabilities). Simply increasing the specs of the machine is linked to drastically
rising costs of maintenance that remain constant even when the infrastructure is not currently in use.
That can be fixed by autoscaling. However, if we create more than 1 instance of our server, we need to introduce:

* A load balancer that will make sure the load is evenly distributed across the server instances, as well as 
spawn/kill additional server instances should that be needed

* A form of shared memory that will contain the information about all currently connected clients, that could be
instantly pulled by the administrator trying to see the full list of all clients and by the server instances themselves,
to make sure that each ID that they assign to the client are unique 

![Standalone standalone architecture](architecture/standaloneArchitectureScaled.png "Standalone scalable architecture")

// TODO: add sequence diagram

## Google Cloud Platform serverless CnC

// TODO: Describe approach with Pub-Sub

// TODO: Describe approach with IoT

## AWS serverless CnC

// TODO: Explore the possibilities

## Heroku? Azure?