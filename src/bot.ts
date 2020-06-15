import jimp from 'jimp';
import path from 'path';
import wa, { create } from '@open-wa/wa-automate';

const fontNames = [
	'yummi',
	'precious',
	'perfect',
	'gliter'
];

const colors = [
	"black",
	"green",
	"blue",
	"pink"
]

const sizes = [
	"64",
	"128"
]

const getRandomFontPaths = (fonts: string[],
	colors: string[], sizes: string[]) => {
	let rand = Math.floor(Math.random() * sizes.length);
	let baseFontName = fonts[rand] + '_';
	let fontPaths = {
		topFont: baseFontName + "128_",
		botFont: baseFontName + "64_"
	};

	rand = Math.floor(Math.random() * colors.length);
	fontPaths.topFont += colors[rand];
	fontPaths.botFont += colors[rand];

	fontPaths.topFont = path.resolve(
		'__dirname',
		'..',
		'fonts',
		`${fontPaths.topFont}`,
		`${fontPaths.topFont}.fnt`
	);
	fontPaths.botFont = path.resolve(
		'__dirname',
		'..',
		'fonts',
		`${fontPaths.botFont}`,
		`${fontPaths.botFont}.fnt`
	);

	return fontPaths;
}

/* Adds your favorite tackeist messges below  */
const openings = [
	''
];

const endings = [
	''
];

const getImage = async () => {
	const image = await jimp
		.read(`https://picsum.photos/800?random=${Math.random()}`);

	const res = {
		image,
		width: image.getWidth(),
		heigth: image.getHeight()
	}
	return res;
}

const getRandomTexts = () => {
	let rand = Math.floor(Math.random() * openings.length);
	const topText = openings[rand];

	rand = Math.floor(Math.random() * endings.length);
	const bottomText = endings[rand];

	return { topText, bottomText };
}

const getXPos = (width: number, textWidth: number) => {
	return (width - textWidth) / 2
}

const placeTopText = (image: jimp, font: any,
	text: string, width: number) => {

	let textWidth = jimp.measureText(font, text);
	let textHeigth = jimp.measureTextHeight(font, text, width);
	let xPos = getXPos(width, textWidth);

	image.print(
		font,
		xPos,
		(textHeigth / 3),
		text,
		width,
		textHeigth
	);

	return image;
}

const placeBotText = (image: jimp, font: any,
	text: string, width: number,
	heigth: number) => {
	let textWidth = jimp.measureText(font, text);
	let textHeigth = jimp.measureTextHeight(font, text, width);
	let xPos = getXPos(width, textWidth);

	image.print(
		font,
		xPos,
		(heigth - textHeigth * 2),
		text,
		width,
		textHeigth
	);

	return image;
}

const targets = async (client: wa.Client, people: string[]) => {
	const contacts = await client.getAllContacts();
	return contacts.filter((contact: wa.Contact) => {
		return people.includes(contact.formattedName);
	});
}

const getBase64Image = async () => {
	// const font64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
	// const font128 = await jimp.loadFont(jimp.FONT_SANS_128_WHITE);

	const { topFont, botFont } = getRandomFontPaths(fontNames, colors, sizes);
	const fonts = {
		top: await jimp.loadFont(topFont),
		bot: await jimp.loadFont(botFont),
	};
	let { image, width, heigth } = await getImage();
	let { topText, bottomText } = getRandomTexts();

	image = placeTopText(image, fonts.top, topText, width);
	image = placeBotText(image, fonts.bot, bottomText, width, heigth)

	return await image.getBase64Async(jimp.MIME_JPEG);
}

const main = async () => {
	const client = await create();
	const people = await targets(client, [
		/* Insert contact names here  */
	]);
	const image = await getBase64Image();

	people.forEach(async person => {
		await client.sendFile(
			person.id._serialized,
			image,
			'/*image-name*/.jpeg',
			'/*message to b displayed along*/'
		);
		console.log('sent ' + person.formattedName);
	});

	// client.kill();
	process.exitCode = 0;
}

main();
