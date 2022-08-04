import { Collider, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class triggerTest extends ZepetoScriptBehaviour {

    public pink:GameObject;
    public blue:GameObject;
    
    Awake(){
        this.pink.SetActive(false);
        this.blue.SetActive(true);
    }

    OnTriggerEnter(coll:Collider){
        this.pink.SetActive(true);
        this.blue.SetActive(false);
        this.Invoke("Change",4);    
    }
    Change(){
        this.pink.SetActive(false);
        this.blue.SetActive(true);
    }

}