import { BoxCollider, MeshCollider, MeshRenderer, Time } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Flicker_2 extends ZepetoScriptBehaviour {

    private timer:float=0;
    public interval:float;
    public mesh:MeshRenderer;
    public collider:MeshCollider;
    public active:bool;

    public startDelay:float;


    Start() {    
        this.gameObject.SetActive(false);
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