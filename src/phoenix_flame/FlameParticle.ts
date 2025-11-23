import { Graphics, ObservablePoint, Point } from "pixi.js";
import { inverseLerp, lerp, lerpColor, vectorAngleFromUp } from "../core/Utill";
import { PhoenixFlame } from "./PhoenixFlame";

export class FlameParticle extends Graphics
{
    public isDead:boolean = false;

    protected lifeTimeCurrent:number = 0;
    protected lifeTimeMax:number = 0;
    protected velocity:Point = new Point(0,0);
    protected acceleration:Point = new Point(0,0);

    protected particleManager:PhoenixFlame;

    constructor(particleManager:PhoenixFlame)
    {
        super();
        this.particleManager = particleManager;
        this.beginFill('white');
        this.drawEllipse(0,0,4,8);
        this.endFill();
    }

    public init(startPos:Point, lifeTime:number)
    {
        this.position.set(startPos.x, startPos.y);
        this.initVelocity();
        this.initAcceleration();
        this.lifeTimeCurrent = 0;
        this.lifeTimeMax = lifeTime;
        this.isDead = false;
        this.tint = 'red';
    }

    protected initVelocity()
    {
        this.velocity.set(-100 + Math.random() * 200,  -20 + Math.random() * 20);
    }

    protected initAcceleration()
    {
        this.acceleration.set(this.velocity.x * -1, -(100 + Math.random() * 100));
    }

    public update(deltaMS:number):void
    {
        if (this.isDead)
        {
            return;
        }

        this.lifeTimeCurrent += deltaMS;

        if (this.lifeTimeCurrent > this.lifeTimeMax)
        {
            this.isDead = true;
            return;
        }

        const deltaTime = deltaMS / 1000;
        
        const lifePercent = inverseLerp(0, this.lifeTimeMax, this.lifeTimeCurrent);

        this.tint = lerpColor('#ff7b00','#fce303', lifePercent);

        this.alpha = lerp(1,0.7, lifePercent);
        const scale = lerp(1,0.5, lifePercent)
        this.scale = new Point(scale, scale);
        
        this.velocity.set(this.velocity.x + (this.acceleration.x * deltaTime), this.velocity.y + (this.acceleration.y * deltaTime))
        

        const xWave = lerp(0, Math.sin(lifePercent * (Math.PI * 10)) * 2, lifePercent);
        this.position.set(this.position.x + (this.velocity.x * deltaTime) + xWave, this.position.y + (this.velocity.y * deltaTime));
        this.rotation = vectorAngleFromUp(this.velocity);

    }
}