import { BooleanLiteral } from 'typescript';
import { AudioSource, GameObject } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class BGM extends ZepetoScriptBehaviour {

    public audio_1:AudioSource;
    public audio_2:AudioSource;
    public audio_3:AudioSource;

    public isA1Play : bool=false;
    public isA2Play : bool=false;
    public isA3Play : bool=false;


    Awake(){
        this.isA1Play=true;
        this.isA2Play=false;
        this.isA3Play=false;
        this.PlayAudio();
    }

    

    PlayAudio(){
        //하나씩만 재생하게 만들고 나머지는 다 스톱 
        if(this.isA1Play&&!this.isA2Play&&!this.isA3Play){
            this.audio_1.Play();
            this.audio_2.Stop();
            this.audio_3.Stop();
            console.log("play1");
        }else if(!this.isA1Play&&this.isA2Play&&!this.isA3Play){
            this.audio_1.Stop();
            this.audio_2.Play();
            this.audio_3.Stop();
            console.log("play2");
        }else if(!this.isA1Play&&!this.isA2Play&&this.isA3Play){
            this.audio_1.Stop();
            this.audio_2.Stop();
            this.audio_3.Play();
            console.log("play3");
        }
        else {
            console.log("error");
        }
    }

    StopAudio(){
        this.audio_1.Stop();
        this.audio_2.Stop();
        this.audio_3.Stop();
    }
   

}