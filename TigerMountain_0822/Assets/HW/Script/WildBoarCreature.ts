import { Random,Vector3 } from 'UnityEngine';
import { NavMeshAgent } from 'UnityEngine.AI';
import { ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class WildBoarCreature extends ZepetoScriptBehaviour {

    private agent:NavMeshAgent;
    private x;
    private y;
    private z;


    Update() {    
        this.agent=this.GetComponent<NavMeshAgent>();
        this.agent.destination = new Vector3(this.x,this.y,this.z);
    }

    SetRange(){
        this.x = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position.x+Random.Range(0,8);
        this.z = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position.z+Random.Range(0,8);
        this.y = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.position.y;
    }

}