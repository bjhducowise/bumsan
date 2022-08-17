import { Collider, GameObject, ParticleSystem } from 'UnityEngine'
import { Particle } from 'UnityEngine.ParticleSystem';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import MusicNote from './MusicNote';

export default class FireWork extends ZepetoScriptBehaviour {

    public script:GameObject;
    public pinkP:ParticleSystem;
    public greenP:ParticleSystem;

    Start(){
        this.pinkP.Stop();
        this.greenP.Stop();
    }

    OnTriggerEnter(coll:Collider){
        var pink = this.script.GetComponent<MusicNote>().GetPink();
        var green=this.script.GetComponent<MusicNote>().GetGreen();
        console.log("trigger");
        if(pink){
            this.pinkP.Play();
            console.log("pink");
        }
        if(green){
            this.greenP.Play();
            console.log("green");
        }
    }

}