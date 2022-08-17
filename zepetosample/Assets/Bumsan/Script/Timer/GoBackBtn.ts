import { GameObject, Quaternion, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { TimeScope } from 'UnityEngine.SocialPlatforms';
import ClientStarterV2 from '../../../ZepetoScripts/ClientStarterV2';
import Timer from './Timer';

export default class GoBackBtn extends ZepetoScriptBehaviour {

    public Timerscript:GameObject;
    public Vally:boolean=false;
    public Cave:boolean=false;
    public Forest:boolean=false;
    public Mountain:boolean=false;
    public pos:Vector3;
    public cs:GameObject; //clientstarter
    zepetoCharacter: any;

    Start(){
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        }); 
    }

    GoBtn(){
        if(this.Vally){
            this.pos=this.zepetoCharacter.transform.position;
            this.VallySideMap();
            this.Timerscript.GetComponent<Timer>().SetTimerPause(true);
        } else if (this.Cave){
            this.pos=this.zepetoCharacter.transform.position;
            this.CaveSideMap();
            this.Timerscript.GetComponent<Timer>().SetTimerPause(true);
        }
    }
    BackBtn(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(this.pos,Quaternion.identity);
        this.cs.GetComponent<ClientStarterV2>().customTeleport(this.pos,Quaternion.identity);
        
        this.Timerscript.GetComponent<Timer>().SetTimerPause(false);
    }

    VallySideMap(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(new Vector3(29,-14,-42),Quaternion.identity);
        this.cs.GetComponent<ClientStarterV2>().customTeleport(new Vector3(29,-14,-42),Quaternion.identity);
    }
    CaveSideMap(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(new Vector3(-9,-11,-104),Quaternion.identity);
        this.cs.GetComponent<ClientStarterV2>().customTeleport(new Vector3(9,-11,-104),Quaternion.identity);
    }
    ForestSideMap(){

    }

    public SetVally(isVally:boolean){
        this.Vally=isVally;
    }
    public SetCave(isCave:boolean){
        this.Cave=isCave;
    }

}