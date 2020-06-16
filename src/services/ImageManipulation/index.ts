import jimp from 'jimp';
import path from 'path';

/*Produce the texts */
/* Add your favorite tackeist messges below  */
const openings = [
	"Bom dia",
	"Deus te abencoe",
	"Um belo dia"
];

const endings = [
	'meu tesouro',
	'meu anjo',
	'nesta'
];

const getRandomTexts = () => {
	let rand = Math.floor(Math.random() * openings.length);
	const topText = openings[rand];

	rand = Math.floor(Math.random() * endings.length);
	const bottomText = endings[rand];

	return { topText, bottomText };
}

/* Produce the fonts */
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

const getRandomFontPaths = () => {
	let rand = Math.floor(Math.random() * sizes.length);
	let baseFontName = fontNames[rand] + '_';
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

/* Produce the image */
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

const getBase64Image = async () => {
	const { topFont, botFont } = getRandomFontPaths();
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

export default getBase64Image;
