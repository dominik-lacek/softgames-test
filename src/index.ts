import { GameApp } from './core/GameApp';
import { parseMagicWordsData } from './magic_words/MagicWordsLoader';

(async () => {
	const app = new GameApp({
		view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		backgroundColor: 0x6495ed,
		resizeTo: window,
	});
	const data = await parseMagicWordsData();
	app.init(data);
})();