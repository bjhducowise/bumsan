import { GameObject, Quaternion, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { TimeScope } from 'UnityEngine.SocialPlatforms';
import Timer from './Timer';
import boatClientStarter from './vehicle/boatClientStarter';

export default class GoBackBtn extends ZepetoScriptBehaviour {

    public Timerscript:GameObject;
    public Vally:boolean=false;
    public Cave:boolean=false;
    public Forest:boolean=false;
    public Mountain:boolean=false;
    public pos:Vector3;
    public cs:GameObject; //clientstarter
    zepetoCharacter: any;
    public gobtn : GameObject;

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
        }else if (this.Forest){
            this.pos=this.zepetoCharacter.transform.position;
            this.ForestSideMap();
            this.Timerscript.GetComponent<Timer>().SetTimerPause(true);
        }else if (this.Mountain){
            this.pos=this.zepetoCharacter.transform.position;
            this.MountainSideMap();
            this.Timerscript.GetComponent<Timer>().SetTimerPause(true);
        }
    }
    BackBtn(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(this.pos,Quaternion.identity);
        //this.cs.GetComponent<boatClientStarter>().customTeleport(this.pos,Quaternion.identity);
        this.gobtn.SetActive(true);
        this.Timerscript.GetComponent<Timer>().SetTimerPause(false);
    }

    VallySideMap(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(new Vector3(7.89,-0.17,129.16),Quaternion.identity);
        //this.cs.GetComponent<boatClientStarter>().customTeleport(new Vector3(29,-14,-42),Quaternion.identity);
        this.gobtn.SetActive(false);
    }
    CaveSideMap(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(new Vector3(7.89,-19.55,111.87),Quaternion.identity);
        console.log("cave teleport");
        this.gobtn.SetActive(false);
         //this.cs.GetComponent<boatClientStarter>().customTeleport(new Vector3(9,-11,-104),Quaternion.identity);
    }
    ForestSideMap(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(new Vector3(-20.91,-2.99,159.63),Quaternion.identity);
        console.log("forest teleport");
        this.gobtn.SetActive(false);
    }
    MountainSideMap(){
        if (this.zepetoCharacter == null) {return 0;}
        this.zepetoCharacter.Teleport(new Vector3(-100.4,-15.39,37.5),Quaternion.identity);
        console.log("mountain teleport");
        this.gobtn.SetActive(false);
    }

    public SetVally(isVally:boolean){
        this.Vally=isVally;
    }
    public SetCave(isCave:boolean){
        this.Cave=isCave;
    }
    public SetForest(isForest:boolean){
        this.Forest=isForest;
    }
    public SetMountain(isMount:boolean){
        this.Mountain=isMount;
    }
    
    public GetVally():boolean{
        return this.Vally;
    }
    public GetCave():boolean{
        return this.Cave;
    }
    public GetForest():boolean{
        return this.Forest;
    }
    public GetMount():boolean{
        return this.Mountain;
    }
}