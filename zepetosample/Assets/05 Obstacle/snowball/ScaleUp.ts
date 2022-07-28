import { Time, Vector3, Coroutine, WaitForSeconds, Random, Collider} from 'UnityEngine';
import { TimeScope } from 'UnityEngine.SocialPlatforms';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class ScaleUp extends ZepetoScriptBehaviour {

    private Time:float;
    private checkTime :float;
    private originpos:Vector3;
    private originscale:Vector3;
    public scaleupdate:Vector3;
    private timer : float;


    Awake(){
        this.timer=0;
        this.Time=0;
        this.checkTime=10;
        this.originpos = this.transform.position;
        this.originscale=this.transform.localScale;
    }
    Update(){

        this.Time+=Time.deltaTime;
        if(this.Time<this.checkTime){
            this.transform.localScale = Vector3.op_Addition(this.transform.localScale,this.scaleupdate);
            if(this.transform.localScale==new Vector3(7,7,7)){
                this.checkTime =0;
            }
        }

        if(this.transform.position.y < -15.7){
            this.transform.position = this.originpos;
            this.transform.localScale = this.originscale;
            this.Time=0;
        }
        
    }
    OnTriggerEnter(coll :Collider){
        while(this.timer<1000){
            ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.StopMoving();
            this.timer+=Time.deltaTime;
        }
        this.timer=0;
    }
    
    


}


