
import {Collider,GameObject,Pose,Quaternion,Time,Vector3} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Timer from './Timer';


export default class TimerOn extends ZepetoScriptBehaviour {

    public script : GameObject;

    

    OnTriggerEnter(coll:Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            this.script.GetComponent<Timer>().setTimerOn(true);
            console.log("timer on");
        }
        
    }

}