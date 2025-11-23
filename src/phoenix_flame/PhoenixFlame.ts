import { FederatedMouseEvent, ParticleContainer, Point, Text, TextStyle } from "pixi.js";
import { View } from "../core/View";
import { FlameParticle } from "./FlameParticle";
import { getGameApp } from "../core/GameApp";

export class PhoenixFlame extends View
{
    public static readonly ID:string = "flame";

    protected particlesPool:FlameParticle[] =[];
    protected particlesActive:FlameParticle[] =[];

    protected spawnCooldown: number = 1;
    protected spawnCount: number = 10;
    protected particleDelayCurrent: number = 0;

    protected tipText:Text;

    protected mousePos:Point = new Point();
    protected isMouseDown:boolean = false;

    constructor()
    {
        super();
        getGameApp().stage.on('globalpointermove', this.onMouseMove, this);
        getGameApp().stage.on('gl', this.onMouseMove, this);
        const style: TextStyle = new TextStyle({
            align: "center",
            fill: "#000000ff",
            fontSize: 15
        });
        this.tipText = new Text("hold and drag to move the flame", style);
        document.body.addEventListener("pointerdown", (event) => { this.isMouseDown = true})
        document.body.addEventListener("pointerup", (event) => { this.isMouseDown = false})
    }

    public override update(deltaMS: number): void
    {
        if (!this.isShowing)
        {
            return;
        }

        this.tipText.position.set(10, getGameApp().screen.height - 20);

        let index = 0;
        while (index < this.particlesActive.length)
        {
            this.particlesActive[index].update(deltaMS);
            if (this.particlesActive[index].isDead)
            {
                this.onParticleDeath(this.particlesActive[index]);
            }
            else
            {
                index++;
            }
        }

        this.particleDelayCurrent += deltaMS;
        if (this.particleDelayCurrent > this.spawnCooldown)
        {
            for (let i = 0; i < this.spawnCount; i ++)
            {
                this.spawnParticle();
            }
            this.particleDelayCurrent = 0;
        }
    }

    public override getID(): string 
    {
        return PhoenixFlame.ID;
    }

    public override show(): void 
    {
        this.mousePos.set(getGameApp().screen.width /2, getGameApp().screen.height /2);
        getGameApp().stage.addChild(this.tipText);
        super.show();
    }

    public override hide(): void 
    {
        getGameApp().stage.removeChild(this.tipText);
        while (this.particlesActive.length > 0)
        {
            this.onParticleDeath(this.particlesActive[this.particlesActive.length -1]);
        }
        super.hide();
    }

    protected onMouseMove = (event: FederatedMouseEvent) =>
    {
        if (this.isMouseDown)
        {
            this.mousePos.set(event.clientX, event.clientY);
        }
    }

    private _cachedParticleOrigin:Point = new Point();
    protected generateParticleOrigin():Point
    {
        this._cachedParticleOrigin.set((25 - Math.random() * 50) + this.mousePos.x, (20 - Math.random() * 40) + this.mousePos.y);
        return this._cachedParticleOrigin;
    }

    protected spawnParticle()
    {
        const particle:FlameParticle = this.getParticle();
        getGameApp().stage.addChild(particle);
        particle.init(this.generateParticleOrigin(),2000 + (1000 - Math.random() * 1000));
    }

    protected getParticle():FlameParticle
    {
        if (this.particlesPool.length > 0)
        {
            this.particlesActive.push(this.particlesPool.pop()!);
            return this.particlesActive[this.particlesActive.length -1];
        }
        else
        {
            const particle = new FlameParticle(this);
            this.particlesActive.push(particle);
            return particle;
        }
    }

    protected onParticleDeath(particle: FlameParticle)
    {
        const index = this.particlesActive.indexOf(particle);
        if (index == -1)
        {
            return;
        }
        getGameApp().stage.removeChild(particle);
        this.particlesActive.splice(index, 1);
        this.particlesPool.push(particle);
    }
}