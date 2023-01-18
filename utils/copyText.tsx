export interface copyText{
    text: string,
    message: React.ReactElement
}
export default async function copyText(text, message) {
	try {
		await navigator.clipboard.writeText(text);
		if(message){
			message.success('Текст успешно скопирован');
		}
		console.log('Text copied to clipboard');
	} catch (err) {
		if(message){
			message.error('Ошибка при копировании текста');
		}
		console.error('Error in copying text: ', err);
	}
}