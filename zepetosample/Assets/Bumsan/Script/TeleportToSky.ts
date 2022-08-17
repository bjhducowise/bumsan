import { GameObject, Quaternion,Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ClientStarterV2 from '../../ZepetoScripts/ClientStarterV2';


export default class TeleportToSky extends ZepetoScriptBehaviour {
    zepetoCharacter: any;
    public cs:GameObject;

    Start(){
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        }); 
    }
    
    Fly(){
        this.zepetoCharacter.Teleport(new Vector3(60,66,17),Quaternion.identity);
        this.cs.GetComponent<ClientStarterV2>().customTeleport(new Vector3(60,66,17),Quaternion.identity);
    }

}