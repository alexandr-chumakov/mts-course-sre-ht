import http from 'k6/http';
import { sleep, check } from 'k6';
import { parse } from "k6/x/yaml";
import { randomInt } from 'k6/lib/math';

const configfile = open("../config.yaml");
const config = parse(configfile);
const hostname = config.hostname
const addressOfAPI = config.address
	
export let options = {
  stages: [
    { duration: '1m', target: 50 },  // Start with 50 RPS for 1 minute
    { duration: '1m', target: 100 }, // Increase to 100 RPS for the next 1 minute
    { duration: '1m', target: 150 }, // Increase to 150 RPS for the next 1 minute
    { duration: '1m', target: 250 }, 
    { duration: '1m', target: 500 }, 
    { duration: '1m', target: 700 }, 
    { duration: '1m', target: 900 }, 
    { duration: '1m', target: 1000 }, 
    { duration: '1m', target: 0 },   // Ramp down to 0 RPS in the last 1 minute
  ],
};

export default function () {

	const url = `${addressOfAPI}/Forecast`; // Replace with your API endpoint
	const params = {
				headers: {
					'Content-Type': 'application/json',
					'Host': hostname
					},
				};

	const getResponse = http.get(url, params);

	// Check if the GET request was successful
	check(getResponse, {
	'GET Success Forecast': (res) => res.status === 200,
	});

	const randomCityID = randomInt(1, 1107);
	const getResponse = http.get(`${url}/Forecast/${randomCityID}` , params);

	// Check if the GET request was successful
	check(getResponse, {
	'GET Success Forecast for City': (res) => res.status === 200,
	});
	
	// Add some sleep time between iterations
	sleep(5);
}


