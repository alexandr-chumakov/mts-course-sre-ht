import http from 'k6/http';
import { parse } from "k6/x/yaml";
import data from '../data/geo_names_list.json';

const configfile = open("../config.yaml");


export default function () {
	const config = parse(configfile);
	const hostname = config.hostname
	console.log(`Line from file: ${hostname}`);
	
	// TODO: POST requests to add all cities from file
	
  for (let i = 0; i < data.length; i++) {
    const line = data[i];
    // Process each line here
    console.log(`Line from file: ${line}`);
  }
	
}
