import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import * as UnityEngine from 'UnityEngine'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import VehicleSystem from './VehicleSystem';

export default class boatUIOnOff extends ZepetoScriptBehaviour {
    public clientStarterObject : UnityEngine.GameObject;
    private clientStarter : VehicleSystem;
    Start() {    
        this.clientStarter = this.clientStarterObject.GetComponent<VehicleSystem>();
    }
    OnTriggerStay(coll : UnityEngine.Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.name)
        {
          this.clientStarter.clientShowVehicleButton();
        }
    }
    OnTriggerExit(coll : UnityEngine.Collider){
        console.log(`ssssssssssssss //${JSON.stringify(coll.transform.name)}`);
        if(coll.isTrigger) console.log(`istrigerr`);
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.name)
        {

           this.clientStarter.clientHideVehicleButton();
        }
    }
}