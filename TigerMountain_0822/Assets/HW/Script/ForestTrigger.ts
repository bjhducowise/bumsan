import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Collider, GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import GoBackBtn from './GoBackBtn';

export default class ForestTrigger extends ZepetoScriptBehaviour {

    public GoScript:GameObject;
    OnTriggerEnter(coll:Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            console.log("forest");
            this.GoScript.GetComponent<GoBackBtn>().SetCave(false);
            this.GoScript.GetComponent<GoBackBtn>().SetForest(true);
        }
    }

}