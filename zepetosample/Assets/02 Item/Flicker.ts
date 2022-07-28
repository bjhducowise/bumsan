import { BoxCollider, MeshRenderer, Time } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Flicker extends ZepetoScriptBehaviour {

    public timer:float;
    public interval:float;
    public mesh:MeshRenderer;
    public collider:BoxCollider;
    public active:bool;

    public startDelay:float;


    Start() {    

    }
    Update(){

        if(this.startDelay>0){
            this.startDelay-=Time.deltaTime;
            return;
        }
        this.timer +=Time.deltaTime;
        if(this.timer>this.interval){
            this.timer=0;
            this.active=!this.active;
            this.mesh.enabled=this.active;
            this.collider.enabled=this.active;
        }
    }

}