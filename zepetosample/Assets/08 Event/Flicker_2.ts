import { BoxCollider, MeshCollider, MeshRenderer, ParticleSystem, Time } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Flicker_2 extends ZepetoScriptBehaviour {

    private timer:float=0;
    public interval:float;
    public mesh:MeshRenderer;
    public particle:ParticleSystem;
    public active:bool;
    public startDelay:float;


    Start() {    
        this.particle.Stop();
    }
    Update(){

        if(this.startDelay>0){
            this.startDelay-=Time.deltaTime;
            return;
        }
        this.timer +=Time.deltaTime;
        if(this.timer>this.interval){
            this.particle.Play();
            this.timer=0;
            
        }
    }

}