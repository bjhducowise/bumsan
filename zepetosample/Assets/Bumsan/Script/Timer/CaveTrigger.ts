import { Collider, GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GoBackBtn from './GoBackBtn';
import Timer from './Timer';


export default class CaveTrigger extends ZepetoScriptBehaviour {

    public Timerscript:GameObject;
    public GoScript:GameObject;

    OnTriggerEnter(coll:Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            this.Timerscript.GetComponent<Timer>().setTimerOn(true);
            console.log("timer on");
            var v=this.GoScript.GetComponent<GoBackBtn>().Vally;
            var c=this.GoScript.GetComponent<GoBackBtn>().Cave;
            if(v==true&&c==false){
                this.GoScript.GetComponent<GoBackBtn>().SetVally(false);
                this.GoScript.GetComponent<GoBackBtn>().SetCave(true);
            }else if(v==false&&c==true){
                this.GoScript.GetComponent<GoBackBtn>().SetVally(true);
                this.GoScript.GetComponent<GoBackBtn>().SetCave(false);
            }
        }
    }
}