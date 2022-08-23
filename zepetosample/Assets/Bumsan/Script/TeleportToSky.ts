import { AnimationClip, Animator, GameObject, Quaternion,RuntimeAnimatorController,Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Player } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import boatClientStarter from '../../04 Boat/04 Boat/boatClientStarter';
import PlayerController from '../../04 Boat/04 Boat/PlayerController';


export default class TeleportToSky extends ZepetoScriptBehaviour {
    zepetoCharacter: any;
    public cs:GameObject;
    public changecarpet:GameObject;
    //public PlayerCtrlScript:GameObject;
    public anim:RuntimeAnimatorController;

    Start(){
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        }); 
        
    }
    
    Fly(){
        var boatcs=this.cs.GetComponent<boatClientStarter>();
        this.zepetoCharacter.Teleport(new Vector3(60,66,17),Quaternion.identity);
        boatcs.customTeleport(new Vector3(60,66,17),Quaternion.identity);
        boatcs.carpetPrefab = this.changecarpet;
        boatcs.boatHeight=66;
        //boatcs.boatCreatePoint = this.zepetoCharacter.transform.position;
        boatcs.setPlayerpos(new Vector3(0,0.2,0));
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.GetComponent<PlayerController>().setAnim(this.anim);


    }

}