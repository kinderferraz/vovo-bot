import getImage from './services/ImageManipulation'
import wa, { create } from '@open-wa/wa-automate';
import moment from 'moment';

const targets = async (client: wa.Client, people: string[]) => {
	const contacts = await client.getAllContacts();
	return contacts.filter((contact: wa.Contact) => {
		return people.includes(contact.formattedName);
	});
}

const sendMessages = async (client: wa.Client, people: wa.Contact[]) => {
	const image = await getImage();
	people.forEach(async person => {
		await client.sendFile(
			String(person.id),
			image,
			moment().format(),
			'testando bot'
		);
		console.log('sent ' + person.formattedName);
	});
}

const main = async () => {
	const client = await create();
	const people = await targets(client, [
		/* Insert contact names here  */
		// "Yasmim Linda",
		"Ian Fernandes",
		// "fofuthom ✨",
		// "Familia",
		// "Empreendedor",
		// "Mãe",
		// "Pai",
		// "Rodrigo Cruz",
		// "Jonas [Fam]",
		// "Nana",
		// "Raphael Pavan"
	]);

	await sendMessages(client, people);

	// client.kill();
	process.exitCode = 0;
}

main();
