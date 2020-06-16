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
	const logs = people.map(async person => {
		const timestamp = moment().format();
		const id = await client.sendFile(
			String(person.id),
			image,
			timestamp,
			'testando bot + timestamp',
			undefined,
			true
		);
		console.log('sent ' + person.formattedName);
		return { id, timestamp };
	});
	return logs;
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
