import {Collider,GameObject,Pose,Quaternion,Time,Vector3} from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Timer from './Timer';
import GoBackBtn from './GoBackBtn';

export default class VallyTrigger extends ZepetoScriptBehaviour {

    public Timerscript:GameObject;
    public GoScript:GameObject;

    OnTriggerEnter(coll:Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            this.Timerscript.GetComponent<Timer>().setTimerOn(true);
            console.log("timer on");
            this.GoScript.GetComponent<GoBackBtn>().SetVally(true);
            
        }
        
    }

}