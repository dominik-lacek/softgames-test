import { Container, Graphics, Point, Sprite, Text, TextStyle } from "pixi.js";
import { MagicWords } from "./MagicWords";
import { DialogueData } from "./MagicWordsLoader";

export class DialogueBox extends Container
{
    protected speechBubbleWidth:number = 300;
    protected speechBubbleHeight:number = 80;

    protected speechBubblePosX:number = 0;
    protected speechBubblePosY:number = 30;

    constructor(parent:MagicWords,dialogue: DialogueData)
    {
        super()
        if (parent.avatars[dialogue.name])
        {
            const avatar = Sprite.from(parent.avatars[dialogue.name].img)
            this.addChild(avatar)
            if (parent.avatars[dialogue.name].position == 'left')
            {
                this.speechBubblePosX = 120;
            }
            else
            {
                avatar.position.set(this.speechBubbleWidth - 10, 0);
            }
        }
        const speechBubble = this.createSpeechBubble(parent, dialogue);
        this.addChild(speechBubble);
        speechBubble.position.set(this.speechBubblePosX, this.speechBubblePosY);

        const style: TextStyle = new TextStyle({
            align: "left",
            fill: "#000000ff",
            fontSize: 13
        });
        const avatarNameText = new Text(dialogue.name, style);
        avatarNameText.position.set(this.speechBubblePosX + 5, this.speechBubblePosY + 5)
        this.addChild(avatarNameText);

        this.createText(
            parent, 
            dialogue, 
            new Point( this.speechBubblePosX + 5, this.speechBubblePosY + 24), 
            new Point( this.speechBubbleWidth - 10, this.speechBubbleHeight - 10), 
        );
    }

    protected createSpeechBubble(parent:MagicWords,dialogue: DialogueData):Graphics
    {
        const bubble:Graphics = new Graphics();
        const arrowWidth:number = 20;
        bubble.beginFill('white');
        bubble.moveTo(0,0);
        bubble.lineTo(this.speechBubbleWidth, 0);
        if (parent.avatars[dialogue.name] == undefined || parent.avatars[dialogue.name].position == 'right')
        {
            bubble.lineTo(this.speechBubbleWidth, this.speechBubbleHeight * 0.25);
            bubble.lineTo(this.speechBubbleWidth + arrowWidth, this.speechBubbleHeight * 0.5);
            bubble.lineTo(this.speechBubbleWidth, this.speechBubbleHeight * 0.75);
            bubble.lineTo(this.speechBubbleWidth, this.speechBubbleHeight);
            bubble.lineTo(0, this.speechBubbleHeight);
        }
        else
        {
            bubble.lineTo(this.speechBubbleWidth, this.speechBubbleHeight);
            bubble.lineTo(0, this.speechBubbleHeight);
            bubble.lineTo(0, this.speechBubbleHeight * 0.75);
            bubble.lineTo(-arrowWidth, this.speechBubbleHeight * 0.5);
            bubble.lineTo(0, this.speechBubbleHeight * 0.25);
        }

        bubble.closePath();
        bubble.endFill();
        return bubble;
    }

    protected createText(parent:MagicWords,dialogueData: DialogueData, startPoint:Point, size:Point)
    {
        const style: TextStyle = new TextStyle({
            align: "left",
            fill: "#000000ff",
            fontSize: 14,
            lineHeight: 20,
            wordWrap: true,
            wordWrapWidth: size.x,
        });
        const styleNoWrap: TextStyle = new TextStyle({
            align: "left",
            fill: "#000000ff",
            fontSize: 14,
            lineHeight: 10,
        });
        
        let textParsedReady:string = "";
        let textSectionInProgress:string = '';
        let isParsingEmoji:boolean = false;
        for (let i = 0; i <= dialogueData.text.length; i++)
        {
            if (i >= dialogueData.text.length)
            {
                textParsedReady += textSectionInProgress;
                const text = new Text(textParsedReady, style);
                this.addChild(text);
                text.position.set(startPoint.x, startPoint.y);
            }

            if (!isParsingEmoji && dialogueData.text.charAt(i) === '{')
            {
                isParsingEmoji = true;
                textParsedReady += textSectionInProgress;
                textSectionInProgress = "";
                continue;
            }
            if (isParsingEmoji && dialogueData.text.charAt(i) === '}')
            {
                isParsingEmoji = false;
                if (parent.emojis[textSectionInProgress])
                {
                    const emoji = Sprite.from(parent.emojis[textSectionInProgress]);
                    emoji.width = 20;
                    emoji.height = 20;
                    let y = startPoint.y -2;
                    const parsedTextWidth = new Text(textParsedReady, styleNoWrap).width;
                    let x = startPoint.x + parsedTextWidth;
                    if (x > startPoint.x + size.x)
                    {
                        x = startPoint.x + (parsedTextWidth - size.x) + 15;
                        y += style.lineHeight;
                    }
                    this.addChild(emoji);
                    textParsedReady += "     ";
                    emoji.position.set(x, y);
                }
                textSectionInProgress = "";
                continue;
            }
            textSectionInProgress = textSectionInProgress + dialogueData.text.charAt(i);
        }
    }
}