import { Transform } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import {GameObject, Input, Time, Vector3} from 'UnityEngine';
 
export default class Rotator extends ZepetoScriptBehaviour {
 
   
    public target:GameObject;
    public movespeed:float;

    Update(){
        
        this.transform.RotateAround(this.target.transform.position,Vector3.up,this.movespeed*Time.deltaTime );
    }
 
    
    
}
