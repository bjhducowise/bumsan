import { Button } from 'UnityEngine.UI';
import { Vector3,Quaternion,Time, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter,ZepetoPlayer,ZepetoPlayers } from 'ZEPETO.Character.Controller';
import Timer from './Timer'

export default class Button1 extends ZepetoScriptBehaviour {

    public testBtn:Button;
    public script : GameObject;

    public pos : Vector3;
    private static bool
    zepetoCharacter: any;
    Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });      
        this.testBtn.onClick.AddListener(()=>{this.ButtonClick();});
    }
    public ButtonClick(){
        console.log("ButtonClick");
        
        var timep = this.script.GetComponent<Timer>().timerPause;
        if(timep==false){
            this.teleport_1();
            this.timerPause();
            this.pos = this.zepetoCharacter.transform.position;
            console.log(this.pos);
            return;
        }else{
            this.teleport_2();
            this.timerRestart();
        }

    

    }

    private teleport_1(){
        if (this.zepetoCharacter == null) 
            return;
        this.zepetoCharacter.Teleport(new Vector3(30.1,-12.24,-13.9),Quaternion.identity);
    }
    private teleport_2(){
        if (this.zepetoCharacter == null) 
            return;
        this.zepetoCharacter.Teleport(this.pos,Quaternion.identity);
    }

    private timerPause(){
        this.script.GetComponent<Timer>().timerPause=true;
        console.log("timer pause");
    }
    private timerRestart(){
        this.script.GetComponent<Timer>().timerRestart=true; 
        this.script.GetComponent<Timer>().timerPause=false;
        console.log("timer restart")
       }

}