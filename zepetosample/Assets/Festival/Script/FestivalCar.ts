import { GameObject,Time,Vector3 } from 'UnityEngine';
import { NavMeshAgent } from 'UnityEngine.AI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class FestivalCar extends ZepetoScriptBehaviour {

    public goal:GameObject;
    private agent:NavMeshAgent;

    Update() {    
        this.agent=this.GetComponent<NavMeshAgent>();
        this.agent.destination=this.goal.transform.position;
    }
}