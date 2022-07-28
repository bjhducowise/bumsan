import { Collider, GameObject } from 'UnityEngine'
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class NewTypescript extends ZepetoScriptBehaviour {

    

    public btn : GameObject;

    OnTriggerEnter(coll:Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            this.btn.SetActive(true);
        }
        
    }

}