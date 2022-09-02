import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoPlayers} from 'ZEPETO.Character.Controller'
import { Collider, WaitForSeconds } from 'UnityEngine';

export default class GoodItem extends ZepetoScriptBehaviour {

    Update(){
        this.transform.Rotate(0,1,0);
    }

    OnTriggerEnter(coll:Collider)
    {
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = 5;
            console.log('speedup');
            this.StartCoroutine(this.Fade(2));
        }
            
    }

    *Fade(tick:number){
        yield new WaitForSeconds(tick);
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = 0;
        console.log("default speed");
    }

}