# How to run the exercises:
data_proccessing and perf_test_locust are python packages, 
we have to create a python environment to execute them

test_automation is a nodejs package. We either need to create a nodejs environment 
or use the dockerized solution. Docker is needed for redis (which was used as a db)

These commands executed in terminal under macOS. Running on win machine can be different.

### How to create the python env:
1, Download python3 (version 3.6+, I developed with 3.8.2)  
2, Enter project root  
3, Create virtualenv for the python projects: `python -m venv .ve`  
4, Activate python virtualenv: `source .ve/bin/activate`  
5, Install python requirements: `pip install -r requirements.txt`

## Exercise 1: performance test

### Gatling:
0, `cd perf_test_gatling`  
1, `./bin/gatling.sh`

### LocustIO:
0, `cd perf_test_locust`  

1a, Run with browser: `locust`  
Open in browser: `http://localhost:8089/` Enter Number of users to simulate and start the simulation.

1b, Run without browser for 60s generating a result CSV : `locust --no-web -c 10 -r 5 --run-time 60s --csv=result.csv`


## Exercise 2: data_processing
0, `cd data_processing`  
1, Run xml parser script: `python parse_json.py`  
2, Run json parser script: `python parse_xml.py`  


## Exercise 3: test_automation
This is a puppeteer nodejs project with redis as a key-value db.
### Running local:
0, Install nodejs(v12.16.2), docker, docker-compose  
1, `cd test_automation`  
2, `npm install`  
3, Start redis: `docker-compose up -d redis`  
4a, Run in headless mode: `npm test`  
4b, Run with browser: `npm run test_with_browser`  
5, Test images are saved in the snapshots folder


### Running in docker:
0, Install: docker, docker-compose
1, `docker-compose run test`
2, Test images are saved in the snapshots folder


