import { AnimationClip, Animator, GameObject, Quaternion, Vector3, WaitForSeconds } from 'UnityEngine'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Stage extends ZepetoScriptBehaviour {

    public singMotion:AnimationClip;
    public guitarMotion:Animator;
    public pianoMotion:Animator;
    public pos:GameObject;
 
    zepetoCharacter: any;

    Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });      
    }
    Sing(){
        this.zepetoCharacter.Teleport(this.pos.transform.position,Quaternion.LookRotation(new Vector3(0,0,-1),new Vector3(0,1,0)));
        
        this.StartCoroutine(this.SING());
    }
    *SING(){
        yield new WaitForSeconds(1);

        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.SetGesture(this.singMotion);
        ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.id).character.SetGesture(this.singMotion);

    }
}