import { Texture } from "pixi.js";
import magicWordsData from "./MagicWordsData.json";

export type DialogueData = 
{
    name: string;
    text: string;
}

export type AvatarData = 
{
    img: Texture;
    position: string;
}

export type MagicWordsData =
{
    dialogue: DialogueData[];
    emojies: { [name: string] : Texture; };
    avatars: { [name: string] : AvatarData; };
}

export async function parseMagicWordsData():Promise<MagicWordsData>
{
    const dialogue:DialogueData[] = [];
    const emojies:{ [name: string] : Texture; } = {};
    const avatars:{ [name: string] : AvatarData; } = {};

    for (let i = 0; i < magicWordsData.dialogue.length; i++)
    {
        dialogue.push({name: magicWordsData.dialogue[i].name, text: magicWordsData.dialogue[i].text });
    }
    for (let i = 0; i < magicWordsData.emojies.length; i++)
    {
        const texture:Texture = await Texture.fromURL(magicWordsData.emojies[i].url)
        emojies[magicWordsData.emojies[i].name] = texture;
    }
    for (let i = 0; i < magicWordsData.avatars.length; i++)
    {
        const texture:Texture = await Texture.fromURL(magicWordsData.avatars[i].url)
        avatars[magicWordsData.avatars[i].name] = {img: texture, position: magicWordsData.avatars[i].position};
    }
    
    const data:MagicWordsData = {dialogue: dialogue, emojies: emojies, avatars: avatars};
    return data;
}