import { check } from 'k6';
import http from 'k6/http';
import { parse } from "k6/x/yaml";


const configfile = open("../config.yaml");

export let options = {
  stages: [
    { duration: '10m', target: 10 }, 
  ],
};


export default function () {
	const config = parse(configfile);
	const hostname = config.hostname
	const addressOfAPI = config.address
	
	console.log(`Using hostname: ${hostname}`);

	const url = `${addressOfAPI}/Forecast`; // Replace with your API endpoint
	const headers = {
				'Content-Type': 'application/json',
				'Host': hostname
				};

	const randomCityID = randomInt(1, 1107);
	const randomForecastID = randomInt(1, 10000000);
	const randomTemperature = randomInt(-40, 40);
	const randomDatetime = 1702500132 - randomInt(-10000, 10000000);

	const requestBody = {
		  "id": randomForecastID,
		  "cityId": randomCityID,
		  "dateTime": randomDatetime,
		  "temperature": randomTemperature,
		  "summary": "chaos engineering testing"
		}

	const responsePost = http.post(url, JSON.stringify(requestBody), { headers });

	check(responsePost, {
			'POST Success': (res) => res.status === 200,
	});

	console.log(`Forecast was POSTed: ${randomForecastID}`);
	
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
