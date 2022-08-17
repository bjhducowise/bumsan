import { Collider,Vector3, WaitForSeconds } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class BestItem extends ZepetoScriptBehaviour {

    Start() {    

    }


    OnTriggerEnter(coll:Collider) {    
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localScale = new Vector3(2,2,2);
                        console.log('scale up');
            this.StartCoroutine(this.Fade(5));

            
        }
    
    }

    *Fade(tick:number){
        yield new WaitForSeconds(tick);
        ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localScale = new Vector3(1,1,1);
        console.log("default scale");

    }


}