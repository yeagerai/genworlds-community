# Genworlds Community Edition

## Usage

### From local machine
From your local machine, run the following command:
```bash
git clone git@github.com:yeagerai/genworlds-community.git
```
Then create a file called `.env` and copy the content of the `.env.example` and replace the corresponding API keys. 

Then run the following command:
```bash
docker-compose up --build
```

Then open your browser and go to `http://localhost/`

If you want the app to directly launch a specific use-case, you can add the following variable to the `.env` file:
```bash
VUE_APP_USE_CASE_ACCESS_POINT=/use-case/roundtable
```
And you can replace `roundtable` by any folder name in the `use_cases/` folder.


### Services
* Frontend interface (Vue): `http://localhost/` port `80`
* World Instance (FastAPI REST): `http://localhost:7457/` port `7457`
* Real web socket (FastAPI WS): `http://localhost:7456/` port `7456`
* Mocked web socket (FastAPI WS): `http://localhost:7455/` port `7455`

### From Replit
Just go to [Replit Genworlds-Community Fork](https://replit.com/@yeagerai/genworlds-community) and click on RUN button.