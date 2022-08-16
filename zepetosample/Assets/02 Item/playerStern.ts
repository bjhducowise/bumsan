import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import * as UnityEngine from 'UnityEngine'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import PlayerController from '../04 Boat/PlayerController';
//import { Vector3 } from 'ZEPETO.Multiplay.Schema';
export default class playerStern extends ZepetoScriptBehaviour {
    private timer:float;
    private playerController : PlayerController;
    Start() {    
        this.timer=0;
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            //this.playerController = ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.GetComponent<PlayerController>();
        });
    }

    OnTriggerEnter(coll: UnityEngine.Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            //ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.StopMoving();
        }
        while(this.timer<5000){
            this.timer +=UnityEngine.Time.deltaTime;
            ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.StopMoving();
            //ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.Teleport(new UnityEngine.Vector3(0,0,0),new UnityEngine.Quaternion(0,0,0,0));
            //ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.transform.position = new UnityEngine.Vector3(0,0,0);
        }  
        this.timer=0;
    }
}