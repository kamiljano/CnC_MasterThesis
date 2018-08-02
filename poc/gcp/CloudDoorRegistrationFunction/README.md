[![Known Vulnerabilities](https://snyk.io/test/github/kamiljano/CloudDoorThesis/badge.svg?targetFile=/poc/gcp/CloudDoorRegistrationFunction/package.json)](https://snyk.io/test/github/kamiljano/CloudDoorThesis)

# About
The cloud function responsible for generating all the necessary cloud resources for a new client
and storing the client information.

# Debugging

## Prerequisities

    npm install -g @google-cloud/functions-emulator
        
## Debugging
        
    functions config set projectId clouddoor-dev
    gcloud init
    set_env.bat
    functions start
    gcloud beta emulators datastore start --no-store-on-disk
    functions deploy CloudDoorRegistrationFunction --trigger-http --entry-point handle
    functions inspect CloudDoorRegistrationFunction
    // functions stop - run when you're done
        
The last instruction prints out the port you should listen to.
Now in Idea create a new Run Configuration for `Attach to Node.js/Chrome`.
It is fairly handy to create a Run Configuration that first deploys and runs the functions in the debug mode before running the `Attach to Node.js/Chrome`

# Manual Deployment

    gcloud init
    gcloud beta functions deploy CloudDoorRegistrationFunction --trigger-http --entry-point handle