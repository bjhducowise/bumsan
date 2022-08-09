import { Camera, Canvas, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class EventCamera extends ZepetoScriptBehaviour {

    
    Update(){ this.GetComponent<Canvas>().worldCamera =GameObject.Find("CameraParent").transform.
        GetChild(0).gameObject.GetComponent<Camera>();
            }
        

}