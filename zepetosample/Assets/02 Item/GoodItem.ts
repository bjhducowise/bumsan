import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {ZepetoPlayers} from 'ZEPETO.Character.Controller'
import { Collider } from 'UnityEngine';

export default class GoodItem extends ZepetoScriptBehaviour {

    OnTriggerEnter(coll:Collider)
    {/*
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.additionalRunSpeed = 5;
            console.log('speedup');
        }
*/            
    }

}