# About

Contains E2E test for the standalone approach.

# Unit Testing

You can run it with the following command

```commandline
npm run windowsTest
```

# Memory consumption

In order to evaluate how much memory the server uses depending on the number of clients connected to it
you can execute the following command

```commandline
npm run resourceConsumption
```

Alternatively if you want the server to use redis, you can use the following command

```commandline
npm run resourceConsumption --redis.host=<redis_host> --redis.port=<redis_port>
```