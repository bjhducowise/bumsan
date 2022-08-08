import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import * as UnityEngine from 'UnityEngine'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import ClientStarter from '../ZepetoScripts/Multiplay/ClientStarter';

export default class boatUIOnOff extends ZepetoScriptBehaviour {
    public clientStarterObject : UnityEngine.GameObject;
    private clientStarter : ClientStarter;
    Start() {    
        this.clientStarter = this.clientStarterObject.GetComponent<ClientStarter>();
    }
    OnTriggerStay(coll : UnityEngine.Collider){
        
        
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name)
        {
            this.clientStarter.clientShowCarpetButton();
        }
    }
    OnTriggerExit(coll : UnityEngine.Collider){
        console.log(`ssssssssssssss //${JSON.stringify(coll.transform.name)}`);
        if(coll.isTrigger) console.log(`istrigerr`);
        /*
        if(coll.gameObject.transform.GetChild(0).name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name)
        {
            this.clientStarter.clientHideCarpetButton();
            this.clientStarter.carpetOff();
            var currentRotation = ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.transform.rotation;
            ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.Teleport(this.clientStarter.getBoatCreatePoint(),currentRotation);
        }*/
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name)
        {

            this.clientStarter.clientHideCarpetButton();
        }
    }
}