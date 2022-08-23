import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import * as UnityEngine from "UnityEngine";
export default class vehicleMovementSynchronization extends ZepetoScriptBehaviour {

    public startMoveVehicle(startPos : UnityEngine.Vector3, endPos : UnityEngine.Vector3){
        this.StartCoroutine(this.moveVehicle(startPos,endPos));
    }
    public stopMoveVehicle(){
        this.StopCoroutine(this.moveVehicle);
    }
    private *moveVehicle(startPos : UnityEngine.Vector3 , endPos : UnityEngine.Vector3){//add
        var dpos = new UnityEngine.Vector3(endPos.x-startPos.x,endPos.y-startPos.y,endPos.z-startPos.z);
        var cPos = startPos;
        var i = 0;
        while(i<6){
            cPos.x +=dpos.x/6;
            cPos.y +=dpos.y/6;
            cPos.z +=dpos.z/6;
            this.gameObject.transform.position = cPos;
            i+=1;
            yield new UnityEngine.WaitForSecondsRealtime(UnityEngine.Time.deltaTime);
        }
    }
}