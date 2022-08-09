import { AnimationClip, Animator, Collider, GameObject, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Dance extends ZepetoScriptBehaviour {

    public DanceAnimator:Animator;
    public car:GameObject;

    Start(){
        this.DanceAnimator=this.GetComponent<Animator>();
    }

    OnTriggerEnter(coll:Collider){
        coll=this.car.GetComponent<Collider>();
        if(coll.gameObject.Equals(this.car)){
            this.DanceAnimator.SetTrigger("Dance");
            console.log("hi");
            this.StartCoroutine(this.idle());
        }
    }

    *idle(){
        yield new WaitForSeconds(3);
        this.DanceAnimator.SetBool("idleBool",true);
    }

}