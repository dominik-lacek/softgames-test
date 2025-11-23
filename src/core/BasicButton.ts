import { Graphics, Text, TextStyle } from "pixi.js";

export class Button extends Graphics
{
    public static readonly WIDTH:number = 100;

    constructor(text:string, onSelect:() => void)
    {
        super();

        this.beginFill('black');
        this.drawRect(0,0,Button.WIDTH,35);
        this.endFill();

        const style: TextStyle = new TextStyle({
            align: "center",
            fill: "#ffffffff",
            fontSize: 10
        });
        const valueText: Text = new Text(text, style);
        this.addChild(valueText);
        valueText.position.set(5,10);
        this.eventMode = 'dynamic'
        this.on("pointertap", onSelect, this);
    }
}