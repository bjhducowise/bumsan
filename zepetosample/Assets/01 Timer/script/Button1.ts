import { Button } from 'UnityEngine.UI';
import { Vector3,Quaternion,Time, GameObject } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter,ZepetoPlayer,ZepetoPlayers } from 'ZEPETO.Character.Controller';
import Timer from './Timer'

export default class Button1 extends ZepetoScriptBehaviour {

    public testBtn:Button;
    public script : GameObject;
    public GetTimerPause : boolean;
    public pos : Vector3;
    public GetTimerOn : boolean;
    
    

    zepetoCharacter: any;
    Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });      
        this.testBtn.onClick.AddListener(()=>{this.ButtonClick();});

        

    }
    public ButtonClick(){
        console.log("ButtonClick");
        this.GetTimerPause=this.script.GetComponent<Timer>().GetTimerPause();
        this.GetTimerOn = this.script.GetComponent<Timer>().getTimerOn();
        console.log("timerOn : ", this.GetTimerOn , "timer pause: ",this.GetTimerPause );
        
        
        

        if(this.GetTimerPause==false){
            console.log("timer pause is false");
            this.teleport_1();
            this.script.GetComponent<Timer>().SetTimerPause(true);
            console.log("now timer pause is : ", this.GetTimerPause, "and timer on is : ", this.GetTimerOn);
            this.pos = this.zepetoCharacter.transform.position;
            console.log(this.pos);
            console.log("and time is : ", this.script.GetComponent<Timer>().GetTime() );
            return 0;
            
        }else if(this.GetTimerPause==true){
            this.teleport_2();
            this.script.GetComponent<Timer>().SetTimerPause(false);
            return 0;
        }

    

    }

    private teleport_1(){
        if (this.zepetoCharacter == null) 
            return 0;
        this.zepetoCharacter.Teleport(new Vector3(30.1,-12.24,-13.9),Quaternion.identity);
    }
    private teleport_2(){
        if (this.zepetoCharacter == null) 
            return 0;
        this.zepetoCharacter.Teleport(this.pos,Quaternion.identity);
    }

    //private timerPause(timer : bool){
      //  this.script.GetComponent<Timer>().timerPause=true;
       // return timer = true;
    
    //}
    private timerRestart(){
        this.script.GetComponent<Timer>().SetTimerPause(false);
        console.log("timer restart")
       }

}