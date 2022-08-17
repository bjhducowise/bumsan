import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoPlayers} from 'ZEPETO.Character.Controller'
import { Collider, WaitForSeconds } from 'UnityEngine';

export default class BadItem extends ZepetoScriptBehaviour {

    OnTriggerEnter(coll:Collider) {    
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = -4;
            console.log('speed down');
            this.StartCoroutine(this.Fade(1));
        }
    
    }
    *Fade(tick:number){
        yield new WaitForSeconds(tick);
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = 0;
        console.log("default speed");
    }

}