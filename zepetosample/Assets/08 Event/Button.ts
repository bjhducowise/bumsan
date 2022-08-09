import { Camera, Canvas, GameObject } from 'UnityEngine'
import { ZepetoPlayer } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Button extends ZepetoScriptBehaviour {

    

    Start() {    
        
    }

    Update(){
        this.GetComponent<Canvas>().worldCamera=GameObject.Find("CameraParent").transform.GetChild(0).gameObject.GetComponent<Camera>();
    }
    

}