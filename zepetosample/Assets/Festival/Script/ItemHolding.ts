import { GameObject, Quaternion,Object, AudioSource } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

var item:GameObject;

export default class ItemHolding extends ZepetoScriptBehaviour {

    public Item:GameObject;

    
    
    HoldingItem(){
        var parent = GameObject.Find("ringDis_R").transform;
            item = Object.Instantiate(this.Item, parent.position, new Quaternion(0,-180,0,1)) as GameObject;
            if(GameObject.Find("ringDis_R") != null )
            {
                var pivot = GameObject.Find("ringDis_R").transform;
                var newObj = new GameObject("FoodPivot");
                newObj.transform.SetParent(pivot.transform);
                item.transform.SetParent(newObj.transform);
                console.log(item.transform.position);
            } 
    }

}