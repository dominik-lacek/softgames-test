import { Button as Button } from "../core/BasicButton";
import { GameApp, getGameApp } from "../core/GameApp";
import { View } from "../core/View";
import { CardSprite } from "./CardSprite";
import { CardStack } from "./CardStack";

export class AceOfShadows extends View
{
    public static readonly CARD_MOVE_COOLDOWN:number = 1000;
    public static readonly CARD_MOVE_TIME:number = 2000;
    public static readonly ID:string = "aceOfShadows";

    protected startStack:CardStack;
    protected endStack:CardStack;
    protected allCards:CardSprite[] = [];

    protected moveCardTimer:number = 0;
    protected shuffleCardTimer:number = 0;

    protected shuffleButton:Button;

    constructor()
    {
        super();
        this.startStack = new CardStack();
        this.endStack = new CardStack();
        this.shuffleButton = new Button("restart + shuffle", this.onSelectShuffle)
        for (let i = 0; i < 144; i++)
        {
            const newCard = new CardSprite(this.startStack, i + 1)
            this.allCards.push(newCard)
        }
        this.startStack.shuffleCards(0);
    }

    public onSelectShuffle = () =>
    {
        this.shuffleAndRestart();
    }

    public override update(deltaMs:number)
    {
        if (!this.isShowing)
        {
            return;
        }

        this.startStack.position.set((getGameApp().screen.width * 0.5) - (this.startStack.getWidth() *0.5), getGameApp().screen.height * 0.20);
        this.endStack.position.set((getGameApp().screen.width * 0.5) - (this.startStack.getWidth() *0.5), getGameApp().screen.height * 0.70);
        this.shuffleButton.position.set((getGameApp().screen.width * 0.5) - Button.WIDTH, getGameApp().screen.height * 0.90);

        for (const card of this.allCards)
        {
            card.update(deltaMs);
        }

        if (this.shuffleCardTimer > 0)
        {
            this.shuffleCardTimer -= deltaMs;
            return;
        }

        this.moveCardTimer -= deltaMs;

        if (this.startStack.isEmpty() && this.moveCardTimer < 0)
        {
            this.shuffleAndRestart();
            return;
        }

        if (this.moveCardTimer < 0)
        {
            this.moveCardTimer = AceOfShadows.CARD_MOVE_COOLDOWN;
            this.startStack.transferTopCardToTarget(this.endStack, AceOfShadows.CARD_MOVE_TIME, true);
        }
    }

    public shuffleAndRestart()
    {
        this.endStack.shuffleCards(0);
        for (const card of this.allCards)
        {
            this.endStack.transferTopCardToTarget(this.startStack, AceOfShadows.CARD_MOVE_TIME, false);
        }
        this.startStack.shuffleCards(1000);
        this.shuffleCardTimer = AceOfShadows.CARD_MOVE_TIME * 1.3;
    }

    public override hide(): void
    {
        if (this.isShowing)
        {
            for (const card of this.allCards)
            {
                getGameApp().stage.removeChild(card);
            }
            getGameApp().stage.removeChild(this.shuffleButton);
        }
        super.hide();
    }

    public override show(): void 
    {
        if (!this.isShowing)
        {
            for (const card of this.allCards)
            {
                getGameApp().stage.addChild(card);
            }
            getGameApp().stage.addChild(this.shuffleButton);
        }
        super.show();
    }

    public override getID(): string 
    {
        return AceOfShadows.ID;
    }
}