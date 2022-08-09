import { GameObject,Quaternion,Vector3 } from 'UnityEngine';
import { Button } from 'UnityEngine.UI';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ClientStarter from '../ZepetoScripts/Multiplay/ClientStarter';

export default class TigerEvent extends ZepetoScriptBehaviour {


    public Btn1:Button;
    public cs : GameObject;
    zepetoCharacter: ZepetoCharacter ;

    /*Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });      
        //this.Btn1.onClick.AddListener(()=>{this.ButtonClick();});
    }*/

    public Teleport(){
        this.zepetoCharacter=ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        console.log("buttonclick");
        if (this.zepetoCharacter == null) {console.log("null"); return 0;}
        this.zepetoCharacter.Teleport(new Vector3(80,54.9,5),Quaternion.identity);
        this.cs.GetComponent<ClientStarter>().r_Teleport(new Vector3(80,54.9,5));
    }

}