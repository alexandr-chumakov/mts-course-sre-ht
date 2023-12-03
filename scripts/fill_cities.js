import http from 'k6/http';
import { parse } from "k6/x/yaml";


const configfile = open("../config.yaml");

export default function () {
	const config = YAML.parse(configfile);
	// TODO: POST requests to add all cities from file
}
