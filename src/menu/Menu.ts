import { AceOfShadows } from "../ace_of_shadows/AceOfShadows";
import { Button } from "../core/BasicButton";
import { getGameApp } from "../core/GameApp";
import { View } from "../core/View";
import { MagicWords } from "../magic_words/MagicWords";
import { PhoenixFlame } from "../phoenix_flame/PhoenixFlame";

export class Menu extends View
{
    protected cardTaskButton:Button;
    protected talkTaskButton:Button;
    protected flameTaskButton:Button;
    public static readonly ID:string = "menu";

    constructor()
    {
        super();
        this.cardTaskButton = new Button("ace of shadows", () => getGameApp().showView(AceOfShadows.ID))
        this.talkTaskButton = new Button("magic words", () => getGameApp().showView(MagicWords.ID))
        this.flameTaskButton = new Button("phoenix flame", () => getGameApp().showView(PhoenixFlame.ID))
    }

    public override update(deltaTime: number): void 
    {
        if (!this.isShowing)
        {
            return;
        }

        this.cardTaskButton.position.set((getGameApp().screen.width * 0.25) - Button.WIDTH, getGameApp().screen.height * 0.5);
        this.talkTaskButton.position.set((getGameApp().screen.width * 0.5) - Button.WIDTH, getGameApp().screen.height * 0.5);
        this.flameTaskButton.position.set((getGameApp().screen.width * 0.75) - Button.WIDTH, getGameApp().screen.height * 0.5);
    }

    public override hide(): void
    {
        if (this.isShowing)
        {
            getGameApp().stage.removeChild(this.cardTaskButton);
            getGameApp().stage.removeChild(this.talkTaskButton);
            getGameApp().stage.removeChild(this.flameTaskButton);
        }
        super.hide();
    }

    public override show(): void 
    {
        if (!this.isShowing)
        {
            getGameApp().stage.addChild(this.cardTaskButton);
            getGameApp().stage.addChild(this.talkTaskButton);
            getGameApp().stage.addChild(this.flameTaskButton);
        }
        super.show();
    }

    public override getID(): string 
    {
        return Menu.ID;
    }
}