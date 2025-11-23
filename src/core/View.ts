export abstract class View
{
    public isShowing:boolean = false;

    public abstract update(deltaTime:number):void;

    public abstract getID():string;

    public hide():void
    {
        this.isShowing = false;
    }

    public show():void
    {
        this.isShowing = true;
    }
}