export interface getJson {
    url: string,
    data: Record<string, unknown>,
}
export default async function getJson(url, data,message):Record<string, unknown> {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data || {})
	});
	let result = await response.text();
	try {
		result=JSON.parse(result);
	} catch (error) {
		console.warn('getJson не может спарсить ответ сервера в JSON', error,'RESPONSE text:',result);
	}
	if(message){
		message[result.type||(response.status==200?'success':'error')]((result.message||result),3);
	}
	return {status:response.status, result};
}