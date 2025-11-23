import { Application, FederatedMouseEvent, FederatedPointerEvent, Text, TextStyle, Ticker } from "pixi.js";
import { View } from "./View";
import { AceOfShadows } from "../ace_of_shadows/AceOfShadows";
import { Button } from "./BasicButton";
import { Menu } from "../menu/Menu";
import { MagicWords } from "../magic_words/MagicWords";
import { MagicWordsData } from "../magic_words/MagicWordsLoader";
import { PhoenixFlame } from "../phoenix_flame/PhoenixFlame";

let instance: GameApp | null = null;

export function getGameApp(): GameApp {
  return instance!;
}

export class GameApp extends Application<HTMLCanvasElement>
{
	protected currentView:View | null = null;
	protected menu:Menu | null = null;
	protected cardTask:AceOfShadows | null = null;

	protected views:View[] = [];

	protected menuButton: Button | null = null;

	protected fpsCounter: Text | null = null;

	protected fpsTimer:number = 0;

    public init(magicWordData:MagicWordsData): void
    {
		instance = this;
		this.stage.eventMode = 'dynamic';
		this.stage.sortableChildren = true;
		
		this.views.push(new Menu());
		this.views.push(new AceOfShadows());
		this.views.push(new MagicWords(magicWordData));
		this.views.push(new PhoenixFlame());
		this.showView(PhoenixFlame.ID);

		Ticker.shared.add(this.update, this)
		this.menuButton = new Button("menu", this.onSelectMenu)
		this.stage.addChild(this.menuButton);

		const style: TextStyle = new TextStyle({
			align: "left",
			fill: "#00ff00ff",
			fontSize: 13
		});

		this.fpsCounter = new Text('-', style);
		this.stage.addChild(this.fpsCounter);
    }

	protected onMouseMove = (event: FederatedPointerEvent) =>
	{
		console.log(event.clientX);
	}

	public onSelectMenu = () =>
	{
		this.showView(Menu.ID);
	}

	public showView = (id:String) =>
	{
		for (const view of this.views)
		{
			if (view.getID() == id)
			{
				view.show();
				this.currentView = view;
			}
			else
			{
				view.hide();
			}
		}
	}

	protected update = ():void =>
	{
		this.currentView?.update(Ticker.shared.deltaMS);
		this.menuButton?.position.set(getGameApp().screen.width - 110,10);
		this.fpsCounter?.position.set(10,10);

		this.fpsTimer -= Ticker.shared.deltaMS;
		if (this.fpsTimer < 0)
		{
			this.fpsTimer = 200;
			this.fpsCounter!.text = Math.floor(1000 /Ticker.shared.deltaMS);
		}
	}
}