const config = require('../../config.json');
export default function getCfgValue(key:string):any{
	const path = key.split('.');
	let value=config[path[0]];
	if(path.length>1){
		for (let i = 1; i < path.length; ++i) {
			value = value[path[i]];
		}
	}
	return value;
}