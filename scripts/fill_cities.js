import { check } from 'k6';
import http from 'k6/http';
import { parse } from "k6/x/yaml";


const configfile = open("../config.yaml");
const datafile = open('../data/geo_names_list.json');


export default function () {
	const config = parse(configfile);
	const data = parse(datafile);

	const hostname = config.hostname
	const addressOfAPI = config.address
	
	console.log(`Using hostname: ${hostname}`);

	const url = `${addressOfAPI}/Cities`; // Replace with your API endpoint
	const headers = {
				'Content-Type': 'application/json',
				'Host': hostname
				};

	for (let i = 0; i < data.length; i++) {
			const requestBody = {
					"id": i,
					"name": data[i]
			}

			const response = http.post(url, JSON.stringify(requestBody), { headers });

			check(response, {
					'POST Success': (res) => res.status === 200,
			});

			console.log(`City processed: ${data[i]}`);
	}

}
