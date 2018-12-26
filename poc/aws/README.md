# About

The project contains a POC of the AWS CloudDoor client.

The POC uses the AWS IoT service to deliver the commands to the client.

# Performance 

You can measure the performance of the solution by entering the e2e directory and running

```commandline
node performanceTeset.js --iotEndpoint "a9zrzf1iwbvv8-ats.iot.eu-west-1.amazonaws.com" --httpEndpoint "https://ptuqtplhyh.execute-api.eu-west-1.amazonaws.com/dev" -o "C:\Users\janoka\funWorkspace\CloudDoor\generatedStats\aws\performance.csv" --override --clients 1000
```