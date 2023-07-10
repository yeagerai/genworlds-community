# Genworlds Community Edition

## Usage

### From Replit

The easiest way to try out the Genworlds framework is with Replit.

Just go to [Replit Genworlds-Community Fork](https://replit.com/@yeagerai/genworlds-community) and click the RUN button.

### From local machine

From your local machine, run the following command:

```bash
git clone git@github.com:yeagerai/genworlds-community.git
```

Then create a file called `.env` and copy the content of the `.env.example` and replace the corresponding API keys.

Then run the following commands:

First to build the docker image

```bash
docker build -t genworlds-world-app -f ./deployments/docker/Dockerfile .
```

And then to run it:

```bash
docker run -p 80:80 -p 9000:9000 -d genworlds-world-app
```

After that, you can open your browser and go to `http://localhost/`

If you want the app to directly launch a specific use-case, you can add the following variable to the `.env` file:

```bash
VUE_APP_USE_CASE_ACCESS_POINT=/use_cases/roundtable
```

And you can replace `roundtable` by any folder name in the `use_cases/` folder.
