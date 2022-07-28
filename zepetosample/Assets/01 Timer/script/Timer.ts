import { GameObject, Time } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button,Image,Text } from 'UnityEngine.UI';
import { MinMaxAttribute } from 'UnityEngine.Rendering.PostProcessing';

export default class Timer extends ZepetoScriptBehaviour {

    public ClockText:GameObject;
    public timer: float;
    public timeSpeed: float = 1;
    public timerOn:bool=false;
    public timerOff:bool=false;
    public timerRestart:bool=false;
    public timerPause : bool = false;
    private min:number;
    private sec:number

    Awake(){
        this.timer = 0;
        this.timerOn = false;
        if(this.timerOn==false){
            console.log("timerOff");
        }else console.log("timerOn");
    }

    FixedUpdate(){

        if(this.timerOn&&this.timerPause==false){

            this.timer+=Time.deltaTime*this.timeSpeed;
            this.ClockText.GetComponent<Text>().text = this.TimerCalc();
            console.log("타이머 진행중");
            // <text> : <> 안에있는 내용은 받아올 component
            // ().text : ()다음에 있는 내용은 받아올 compoenent의 내용
        }
        else if( this.timerPause==true&&this.timerOn==true&&this.timerRestart==false&&this.timerOff==false){
            this.timer +=0;
            this.ClockText.GetComponent<Text>().text = this.TimerCalc();
            console.log("일시정지 "+this.timer);
        }
        else if(this.timerPause==false && this.timerOn==true&&this.timerRestart==true&&this.timerOff==false){
            this.timer+=Time.deltaTime*this.timeSpeed;
            this.ClockText.GetComponent<Text>().text = this.TimerCalc();
        }
        else if(this.timerOff==true){
            this.timer=0;
            this.ClockText.GetComponent<Text>().text = this.TimerCalc();
        }



    }

    TimerCalc(){
        this.sec = Math.floor(this.timer%60);
        this.min = Math.floor((this.timer/60));

        return this.min+" : " + this.sec;
    }

    getTimerOn():bool {
        return this.timerOn;
    }

    //public setTimerOn(timeron:bool){
    //    this.timerOn=timeron;
    //}
    //public setTimerPause(timerp:bool){
    //    this.timerPause=timerp;
    //}



}