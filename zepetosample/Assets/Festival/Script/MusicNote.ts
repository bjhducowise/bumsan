import { GameObject, ParticleSystemGameObjectFilter, Time, Vector3 } from 'UnityEngine'
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class MusicNote extends ZepetoScriptBehaviour {

    public pinknote:GameObject;
    public greennote:GameObject;
    public movespeed:float;
    zepetoCharacter: any;
    public isPink:bool;
    public isGreen:bool;
    private pinkPos:Vector3;
    private greenPos:Vector3;
    Start() {    
        this.pinknote.SetActive(false);
        this.greennote.SetActive(false);
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });  
        this.pinknote.SetActive(false);
    }
    Update(){
        if(this.isPink){
            this.pinknote.SetActive(true);
            this.pinkPos=Vector3.op_Addition(this.zepetoCharacter.transform.position,new Vector3(1,1,1));
            this.pinknote.transform.position=Vector3.Lerp(this.pinknote.transform.position,this.pinkPos,this.movespeed*Time.deltaTime);
            this.pinknote.transform.Rotate(0,1,0);
        }
        if (this.isGreen){
            this.greennote.SetActive(true);
            this.greenPos = Vector3.op_Addition(this.zepetoCharacter.transform.position,new Vector3(1.3,1,1.3));
            this.greennote.transform.position=Vector3.Lerp(this.greennote.transform.position,this.greenPos,this.movespeed*Time.deltaTime)
            this.greennote.transform.Rotate(0,1,0);
        }
    }
    Pink(){this.isPink=true;}
    Green(){this.isGreen=true;}
    public GetPink():boolean{return this.isPink;}
    public GetGreen():boolean{return this.isGreen;}
}