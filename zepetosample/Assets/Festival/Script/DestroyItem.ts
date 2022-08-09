import { GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class DestroyItem extends ZepetoScriptBehaviour {

    Destroy(){
        var item = GameObject.Find("FoodPivot");
        GameObject.Destroy(item);
    }

}