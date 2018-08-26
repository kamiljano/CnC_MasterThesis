[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/CloudDoorThesis/badge.svg?targetFile=/poc/gcp/CloudDoorRegistrationFunction/package.json)](https://snyk.io/test/github/kamiljano/CloudDoorThesis)

# About

The project was supposed to contain a POC of the Google Cloud Platform approach, however, turns out that
it's not possible to implement one in a completely serverless manner.

# Serverless applications on GCP

There are 2 distinct application englines available on Google Cloud Platform:

* Google App Engine 
  * allows you to create various applications exposing HTTP endpoints, triggered by timer and others.
  * allows you to create your application in a number of different programming languages
  * offers a wide range of built-in monitoring tools that do not require any additional configuratoin
  * does not allow the portability between different clouds, as the App Engine is quite unique in its design
* Cloud Function
  * at the moment they are still in beta version
  * only allows you to create JavaScript applications
  * allows you to create applications that can be ported between different clouds 
  
Both of these approaches have a very limited execution time (a base concept of serverless design) and do not provice
any push notification functionality out of the box.

# Push notification

Google Cloud Platform provides 2 solutions to the problem of building the push notification services:

* Pub/Sub service - the very name of the service suggests that this would be exactly what we're looking for in this case,
however the Pub/Sub service:
  * is originally designed to serve the notifications to gcp-hosted applications. It is however possible
  to expose a form of credentials for web services that are hosted elsewhere, so that can be walked around.
  * stores the undelivered messages - this is an issue. The service does not provide us with the information
  on whether a certain client is currently connected and actively listening to notifications or not.
  As a result we can easily end up in a situation where we issue a number of commands,
  that cannot be executed at the moment since the client is offline and then once the client goes online
  again, all commands are executed in the same time.
* IoT service - on the first glance feels much more convenient than the Pub/Sub service, as it is
designed to serve the clients running outside of the cloud environment and can provide the information on
whether the certain client is currently online or not. However, the only way to push commands to the client
is through the configuration. It is only possible to push one configuration at a time. It's extremely inconvenient
to build the system that would allow us to make sure that we don't actually submit more than one notification at a time.
Then the configurations are versioned. GCP will always remember every command that we ever issue (what obviously indicates that it's not meant for a purpose like ours).
And finally, if we issue a command when the client is offline, it is still delivered later on.
It makes it extremely risky to for have a number of clients randomly starting for instance DDoSing a server hours after
the user decided that the attack should be over.

# Firebase

Firebase is a whole separate cloud service provided by google that can integrate with the GCP very easily.
It provides a number of features that are supposed to help the developers build mobile applications.
Effectively it contains all basic features such as user management, a file store, a database and a push notifications service.
This push notification service, although delivers the notifications exactly in the way we want it to (deliver at most once)
the SDK only exists for the Android applications, what yields it unusable for us.