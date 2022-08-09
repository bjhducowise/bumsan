import { GameObject,MeshCollider,MeshRenderer,ParticleSystem,Time,Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Event extends ZepetoScriptBehaviour {

    //rotation 
    public rotTarget : GameObject;
    public rotSpeed : float;
    //flicker
    public timer:float;
    public interval:float;
    public mesh:MeshRenderer;
    public active:bool;
    public startDelay : float;
    //particle
    public particle:ParticleSystem;
    
    
    Start(){
        this.particle.Stop();
    }
    Update() {    
       
        this.transform.RotateAround(this.rotTarget.transform.position,Vector3.up,this.rotSpeed*Time.deltaTime );
        
        if(this.startDelay>0){
            this.startDelay-=Time.deltaTime;
            return;
        }

        this.timer +=Time.deltaTime;
        if(this.timer>this.interval){
            this.particle.Play();
            this.timer=0;
            this.active =!this.active;
            this.mesh.enabled=this.active;
        }
    
    }
    
}
