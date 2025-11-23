import { Point } from "pixi.js";
import { CardSprite } from "./CardSprite";
import { getGameApp } from "../core/GameApp";

export class CardStack
{
    public static readonly MAX_WIDTH:number = 400;
    public static readonly CORRECT_CARDS_TIME:number = 300;

    public position:Point = new Point(0,0);
    public maxCardSpacing = 30;
    protected cardsContained:CardSprite[] = []; 

    public getWidth():number
    {
        return Math.min(CardStack.MAX_WIDTH, getGameApp().screen.width);
    }

    public getCardPosX(cardStackPos:number):number
    {
        const spaceBetweenCards = Math.min(this.maxCardSpacing, this.getWidth() / Math.max(this.cardsContained.length, 1))
        return this.position.x + (spaceBetweenCards * cardStackPos);
    }

    public getCardPosY():number
    {
        return this.position.y;
    }

    public isEmpty():boolean
    {
        return this.cardsContained.length <= 0;
    }

    public addCardToTop(card:CardSprite, skipCorrectionAnim?:boolean)
    {
        this.cardsContained.push(card);
        this.correctCardsPositionsInStack(skipCorrectionAnim? 0 : CardStack.CORRECT_CARDS_TIME, card);
    }

    public addCardToStack(card:CardSprite,pos:number)
    {
        this.cardsContained.splice(pos, 0, card);
        this.correctCardsPositionsInStack(CardStack.CORRECT_CARDS_TIME, card);
    }

    public findSortedPosForCard(card:CardSprite):number
    {
        if (this.cardsContained.length <= 0)
        {
            return 0;
        }
        let index = 0;
        while (true)
        {
            if (index > this.cardsContained.length -1)
            {
                return this.cardsContained.length;
            }
            else if (card.cardValue > this.cardsContained[index].cardValue)
            {
                index++;
                continue;
            }
            else
            {
                return index;
            }
        }
    }

    public shuffleCards(time:number): void 
    {
        for (let i = this.cardsContained.length - 1; i > 0; i--)
        {
            const shufflePos = Math.floor(Math.random() * (i + 1));
            [this.cardsContained[i], this.cardsContained[shufflePos]] = [this.cardsContained[shufflePos], this.cardsContained[i]];
        }
        this.correctCardsPositionsInStack(time);
    }

    public correctCardsPositionsInStack(correctionTime:number, skipCard?:CardSprite):void
    {
        for (let i = 0; i < this.cardsContained.length;i++)
        {
            this.cardsContained[i].setCardPosInStack(i);
            this.cardsContained[i].zIndex = i;
            if (this.cardsContained[i] == skipCard || this.cardsContained[i].isTransferInProgress)
            {
                continue;
            }

            this.cardsContained[i].correctCardPositionInStack(correctionTime);
        }
    }

    public transferTopCardToTarget(target:CardStack, transferTime:number, sort:boolean)
    {
        const card = this.cardsContained.pop();
        if (card)
        {
            this.correctCardsPositionsInStack(CardStack.CORRECT_CARDS_TIME, undefined);
            card.transferCardToStack(target, transferTime);
            card.moveToFrontForTime(transferTime - (transferTime * 0.5));
            if (sort)
            {
                target.addCardToStack(card, target.findSortedPosForCard(card));
            }
            else
            {
                target.addCardToTop(card);
            }
        }
    }
}