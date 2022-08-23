import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collider, Animator, CharacterController, Vector3, Quaternion, RuntimeAnimatorController, AnimationClip} from "UnityEngine"
import { UnityEvent  } from "UnityEngine.Events"
import Carpet from "./Carpet"
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from 'ZEPETO.Character.Controller'
import { getLeadingCommentRanges } from 'typescript'

export default class PlayerController extends ZepetoScriptBehaviour {

    public enterAreaEvent : UnityEvent = new UnityEvent();
    public exitAreaEvent : UnityEvent = new UnityEvent();
    private anim : Animator;
    private characterController : CharacterController;
    private zepetoCharacter : ZepetoCharacter;
    public isTiger:boolean;
    
    Start() {
        this.anim=this.gameObject.GetComponentInChildren<Animator>();
        this.characterController= this.gameObject.GetComponent<CharacterController>();
        this.zepetoCharacter = this.gameObject.GetComponent<ZepetoCharacter>();
    }
    public offController(){
        this.anim.SetBool("idleBool",true);  
        this.anim=this.gameObject.GetComponentInChildren<Animator>();
        this.characterController.enabled = true;
        this.zepetoCharacter.enabled = true;
        
        }
    public Ride(carpet : Carpet)
    {
        this.anim.SetBool("idleBool",false);
        this.anim.SetTrigger("Ride");
        console.log("Ride!");
        
        this.characterController.enabled = false;
        this.zepetoCharacter.enabled = false;
        this.gameObject.transform.position = carpet.transform.position;
        this.transform.SetParent(carpet.transform);
        //this.gameObject.transform.position.y = (carpet.transform.position.y+1);
        //carpet.transform.SetParent(this.transform);
        carpet.rotateAction = (angle)=>{
            this.transform.rotation = Quaternion.AngleAxis(angle, Vector3.up);
        };
        
        carpet.Fly(Vector3.op_Addition(carpet.transform.position ,Vector3.up), 0.1);
    }

    OnTriggerEnter(coll: Collider) {
        if(coll.tag == "Area"){
            this.enterAreaEvent.Invoke();        
        }
    }

    OnTriggerExit(coll: Collider) {
        if(coll.tag == "Area"){
            this.exitAreaEvent.Invoke();
        }
    }

    public setAnim(animation:RuntimeAnimatorController){
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject.transform.GetChild(0).gameObject.GetComponent<Animator>().runtimeAnimatorController = animation;
    }

    public IsTiger(tiger:boolean){
        this.isTiger=tiger;
    }
}