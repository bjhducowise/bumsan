import { AnimationClip, Collider, WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class CreatureObstacle extends ZepetoScriptBehaviour {

    public gesture:AnimationClip;
    

    OnTriggerEnter(coll: Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.StopMoving();
            
            
                const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
                character.SetGesture(this.gesture);
                this.StartCoroutine(this.StopCharacterGesture(this.gesture.length - 0.6));
                
            
        }
    }
    *StopCharacterGesture(length:number){
        yield new WaitForSeconds(length);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        character.CancelGesture();   
            
        }

}