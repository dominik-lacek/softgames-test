import { Texture } from "pixi.js";
import { View } from "../core/View";
import { MagicWordsData } from "./MagicWordsLoader";
import { getGameApp } from "../core/GameApp";
import { DialogueBox } from "./Dialogue";

export class MagicWords extends View
{
    public static readonly ID:string = "magicWords";
    public emojis: { [name: string] : Texture; } = {};
    public avatars: { [name: string] : {img: Texture, position: string}; } = {};

    protected dialogueBoxesAll:DialogueBox[] = [];
    protected dialogueBoxesShowing:DialogueBox[] = [];

    protected spacingBetweenBoxes:number = 120;

    protected showNextTimer = 0;
    protected showNextTimerMax = 2000;
    protected currentDialogueIndex = 0;

    constructor(data:MagicWordsData)
    {
        super();
        this.emojis = data.emojies;
        this.avatars = data.avatars;
        for (const element of data.dialogue)
        {
            const box = new DialogueBox(this, element);
            this.dialogueBoxesAll.push(box);
        }
    }

    public override update(deltaTime: number): void
    {
        if (!this.isShowing)
        {
            return;
        }

        this.showNextTimer -= deltaTime;
        if (this.showNextTimer < 0)
        {
            this.showNextTimer = this.showNextTimerMax;
            if (this.currentDialogueIndex < this.dialogueBoxesAll.length)
            {
                this.dialogueBoxesShowing.push(this.dialogueBoxesAll[this.currentDialogueIndex]);
                getGameApp().stage.addChild(this.dialogueBoxesAll[this.currentDialogueIndex]);
                this.currentDialogueIndex++;
            }
            else
            {
                this.reset();
            }
        }

        for (let i = 0; i < this.dialogueBoxesShowing.length; i++)
        {
            const pos = this.dialogueBoxesShowing.length - i;
            this.dialogueBoxesShowing[i].position.set((getGameApp().screen.width /2) - (this.dialogueBoxesShowing[i].width /2), getGameApp().screen.height - (pos * this.spacingBetweenBoxes) - 30)
        }
    }

    public override getID(): string 
    {
        return MagicWords.ID;
    }

    public override show(): void 
    {
        for (const box of this.dialogueBoxesShowing)
        {
            getGameApp().stage.addChild(box);
        }
        super.show();
    }

    public override hide(): void 
    {
        for (const box of this.dialogueBoxesShowing)
        {
            getGameApp().stage.removeChild(box);
        }
        super.hide();
    }

    public reset()
    {
        for (const box of this.dialogueBoxesShowing)
        {
            getGameApp().stage.removeChild(box);
        }
        this.dialogueBoxesShowing = [];
        this.currentDialogueIndex = 0;
    }

}