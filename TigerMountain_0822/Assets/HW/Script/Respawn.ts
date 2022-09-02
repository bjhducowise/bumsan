import { Collider, GameObject, Quaternion, Vector3 } from 'UnityEngine';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GoBackBtn from './GoBackBtn';

export default class Respawn extends ZepetoScriptBehaviour {
    zepetoCharacter: ZepetoCharacter;
    public GoScript:GameObject;

    Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        }); 

        
    }

    /*OnTriggerEnter(coll:Collider){
        if (this.zepetoCharacter == null) {console.log("null"); return 0;}
        this.zepetoCharacter.Teleport(new Vector3(14,-2,17),Quaternion.identity);
        //this.zepetoCharacter.transform.position = new Vector3(14,-2,17);
        console.log("teleport");
    }*/
    OnTriggerEnter(coll : Collider){

        var vally = this.GoScript.GetComponent<GoBackBtn>().GetVally();
        var cave = this.GoScript.GetComponent<GoBackBtn>().GetCave();
        var forest = this.GoScript.GetComponent<GoBackBtn>().GetForest();
        var mount = this.GoScript.GetComponent<GoBackBtn>().GetMount();

        if (this.zepetoCharacter == null) {console.log("null"); return 0;}
        if(vally){
            this.zepetoCharacter.Teleport(new Vector3(10.45,-11.4,15.29),Quaternion.identity);
        } else if (cave){
            this.zepetoCharacter.Teleport(new Vector3(9.94,-10.48,73.2),Quaternion.identity);
        }else if(forest){
            this.zepetoCharacter.Teleport(new Vector3(-45.272,-13.85,138.75),Quaternion.identity);
        }else if(mount){
            this.zepetoCharacter.Teleport(new Vector3(-100.4,-15.39,78.08),Quaternion.identity);
        }
        else{
            this.zepetoCharacter.Teleport(new Vector3(14,-2,17),Quaternion.identity);
        }
    }

}