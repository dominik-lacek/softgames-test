import { DisplayObject, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { CardStack } from "./CardStack";
import { getGameApp } from "../core/GameApp";
import { lerp } from "../core/Utill";

export class CardSprite extends Sprite
{
    public static readonly WIDTH:number = 69;
    public static readonly HEIGHT:number = 108;
    public static readonly BORDER_THICKNESS:number = 1;

    public cardValue:number = 0;

    protected cardPosInStack:number = 0;

    protected timeInFront:number = 0;

    protected currentStack:CardStack;
    protected transferLerp:number = 0;
    protected transferTimeElapsed:number = 0;
    protected transferTimeEnd:number = 0;
    protected transferStartX:number = 0;
    protected transferStartY:number = 0;
    private _lerpT:number = 1;

    public get isTransferInProgress():boolean
    {
        return this._lerpT <= 0.95;
    }

    constructor(startStack: CardStack, cardValue: number)
    {
        const square:Graphics = new Graphics();
        square.beginFill('black');
        square.drawRect(0,0,CardSprite.WIDTH,CardSprite.HEIGHT);
        square.endFill();

        square.beginFill('white');
        square.drawRect(CardSprite.BORDER_THICKNESS, CardSprite.BORDER_THICKNESS, CardSprite.WIDTH - (CardSprite.BORDER_THICKNESS *2), CardSprite.HEIGHT - (CardSprite.BORDER_THICKNESS *2));
        square.endFill();

        const texture = getGameApp().renderer.generateTexture(square);

        super(texture);

        this.anchor.set(0.5, 0.5)
        this.cardValue = cardValue;

        const style: TextStyle = new TextStyle({
            align: "left",
            fill: "#ff0000ff",
            fontSize: 20
        });
        const valueText: Text = new Text(this.cardValue.toString(), style);
        valueText.position.set(-20,-40);

        this.addChild(valueText);

        this.width = CardSprite.WIDTH;
        this.height = CardSprite.HEIGHT;

        this.currentStack = startStack;
        this.currentStack.addCardToTop(this, true);
    }

    public update(deltaMs:number)
    {
        if (this.timeInFront > 0)
        {
            this.timeInFront -= deltaMs;
            this.zIndex = 200;
        }
        else if (this.zIndex != this.cardPosInStack)
        {
            this.zIndex = this.cardPosInStack;
        }

        this.transferTimeElapsed += deltaMs;
        this._lerpT = 1;
        if (this.transferTimeEnd > 0)
        {
            this._lerpT = Math.min(1, this.transferTimeElapsed / this.transferTimeEnd);
        }
        const x = lerp(this.transferStartX, this.currentStack.getCardPosX(this.cardPosInStack), this._lerpT);
        const y = lerp(this.transferStartY, this.currentStack.getCardPosY(), this._lerpT);
        this.position.set(x,y);
    }

    public setCardPosInStack(pos:number)
    {
        this.cardPosInStack = pos;
    }

    public transferCardToStack(target:CardStack, transferTime:number)
    {
        this.currentStack = target;
        this.transferStartX = this.position.x;
        this.transferStartY = this.position.y;
        this.transferLerp = 0;
        this.transferTimeElapsed = 0;
        this.transferTimeEnd = transferTime;
    }

    public correctCardPositionInStack(correctionTime:number)
    {
        this.transferCardToStack(this.currentStack, correctionTime);
    }

    public moveToFrontForTime(time:number)
    {
        this.timeInFront = time;
        this.zIndex = 200;
    }
}