import { AudioSource,Collider, Light, WaitForSeconds } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Stairs extends ZepetoScriptBehaviour {

    public sound :AudioSource;
    public light:Light;
    private Setintensity:float=62;
    
    Start(){
        this.light = this.GetComponent<Light>();
        this.light.intensity=0;
    }
    
    OnTriggerEnter(coll:Collider){
        this.sound.Play();
        this.light.intensity=this.Setintensity;
        this.StartCoroutine(this.LightOn());
    }

    *LightOn(){
        yield new WaitForSeconds(3);
        this.light.intensity=0; 
    }
}