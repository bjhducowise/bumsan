import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoPlayers} from 'ZEPETO.Character.Controller'
import { Collider, GameObject, Mesh, WaitForSeconds,Vector3 } from 'UnityEngine';

export default class BadItem extends ZepetoScriptBehaviour {

    Update(){
        this.transform.Rotate(0,1,0);
    }

    OnTriggerEnter(coll:Collider) {    
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = -2;
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localScale = new Vector3(0.5,0.5,0.5);
            console.log('speed down');
            this.StartCoroutine(this.Fade(2));
        }
    
    }
    *Fade(tick:number){
        yield new WaitForSeconds(tick);
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = 0;
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localScale = new Vector3(1,1,1);
        console.log("default speed");
    }

}