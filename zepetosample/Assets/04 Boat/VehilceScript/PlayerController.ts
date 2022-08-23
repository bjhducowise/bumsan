import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {Collider, Animator, CharacterController, Vector3, Quaternion} from "UnityEngine"
import { UnityEvent  } from "UnityEngine.Events"
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from 'ZEPETO.Character.Controller'

export default class PlayerController extends ZepetoScriptBehaviour {

    public enterAreaEvent : UnityEvent = new UnityEvent();
    public exitAreaEvent : UnityEvent = new UnityEvent();
    private anim : Animator;
    private characterController : CharacterController;
    private zepetoCharacter : ZepetoCharacter;
    Start() {
        this.anim = this.gameObject.GetComponentInChildren<Animator>();
        this.characterController= this.gameObject.GetComponent<CharacterController>();
        this.zepetoCharacter = this.gameObject.GetComponent<ZepetoCharacter>();
    }
    public offController(){
        this.characterController.enabled = true;
        this.zepetoCharacter.enabled = true;
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

}