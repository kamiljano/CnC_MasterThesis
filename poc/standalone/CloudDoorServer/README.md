# About

The module contains a standalone CnC server capable of running any environment supporting Node.js.

# Single server execution

In order to run, execute the following command

```
    node app.js
```

![Standalone architecture](../../../architecture/standaloneArchitecture.png "Standalone architecture")

# Multi-server execution

In order to scale up, the application requires a Redis instance to exchange the data about
connected clients.

To enable such mode, run 

```
    node app.js --redis=redis://<redis url>
```

![Standalone standalone architecture](../../../architecture/standaloneArchitectureScaled.png "Standalone scalable architecture")