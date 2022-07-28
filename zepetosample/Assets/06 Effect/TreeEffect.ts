import { AudioSource, Collider, ParticleSystem } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Particle } from 'UnityEngine.ParticleSystem';


export default class TreeEffect extends ZepetoScriptBehaviour {


    public audioSource : AudioSource ;
    public particle : ParticleSystem;



    Awake(){
        this.particle.Stop();
    }
    OnTriggerEnter(coll : Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            this.audioSource.Play();
            this.particle.Play();
            
        }
        console.log("trigger enter ");
    }

}