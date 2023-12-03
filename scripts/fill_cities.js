import http from 'k6/http';
import { sharedArray } from 'k6/data';
import { parse } from "k6/x/yaml";


const configfile = open("../config.yaml");

// Load file content into a shared array
const fileContent = sharedArray('fileContent', function () {
  return open('../data/geo_names_list.txt').read(1 << 30);
});


export default function () {
	const config = YAML.parse(configfile);
	const hostname = config.hostname
	console.log(`Line from file: ${hostname}`);
	
	// TODO: POST requests to add all cities from file
	
	// Split the file content into lines
	const lines = fileContent.split('\n');

	// Iterate over lines
	for (let i = 0; i < 10 /* lines.length */; i++) {
	  const line = lines[i];
	  // Process each line here
	  console.log(`Line from file: ${line}`);
	}
	
}
