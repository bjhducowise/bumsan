import { Time, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class PointLight extends ZepetoScriptBehaviour {

    zepetoCharacter:any;
    Start() {    
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });  
    }
    Update(){
        this.gameObject.transform.position = Vector3.op_Addition(this.zepetoCharacter.transform.position,new Vector3(2,2,0));
        this.gameObject.transform.position=Vector3.Lerp(this.gameObject.transform.position,this.gameObject.transform.position,1*Time.deltaTime);
        //this.gameObject.transform.Rotate(0,1,0);
    }

}