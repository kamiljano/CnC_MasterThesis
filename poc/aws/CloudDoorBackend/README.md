# Command Delivery

There are multiple push notification-like services in AWS:

* SNS - Simple Notification Service - this one however is only meant for service-to-service communication
* IoT Core - until recently the only service that could allow the developer to create a serverless chat on AWS.
* AppSync - a service advertised specifically for the use in chat applications. In that sense it might be useful for our
use case - based on https://github.com/chief-wizard/serverless-appsync-chat-app. - not necessarily suitable
as it forces us to permanently store every command. Also it requires user authentication with user pool.