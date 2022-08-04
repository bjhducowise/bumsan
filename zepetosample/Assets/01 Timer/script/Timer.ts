import { GameObject, Time } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { Button,Image,Text } from 'UnityEngine.UI';
import { MinMaxAttribute } from 'UnityEngine.Rendering.PostProcessing';

export default class Timer extends ZepetoScriptBehaviour {

    public ClockText:GameObject;
    public timer: float=0;
    public timeSpeed: float = 1;
    private timerOn:boolean = false;
    private timerPause : boolean = false;
    private min:number;
    private sec:number

    Start(){this.timer = 0;}
    Update(){
        if(this.timerOn==true){
            if(this.timerPause==true){
                this.timer+=0;
                this.ClockText.GetComponent<Text>().text = this.TimerCalc();
                return 0;
            }else if(this.timerPause==false){
                this.timer+=Time.deltaTime*this.timeSpeed;
                this.ClockText.GetComponent<Text>().text = this.TimerCalc();
                return 0;
            }

        }else if(this.timerOn ==false ){ this.timer=0; }
    }
    TimerCalc(){
        this.sec = Math.floor(this.timer%60);
        this.min = Math.floor((this.timer/60));
        return this.min+" : " + this.sec;
    }
    getTimerOn() : boolean {return this.timerOn;}
    public setTimerOn(timer:boolean){this.timerOn = timer;}
    public SetTimerPause(timer:boolean){this.timerPause = timer;}
    public GetTimerPause():boolean{return this.timerPause;}
    GetTime() : float {return this.timer;}
    
}