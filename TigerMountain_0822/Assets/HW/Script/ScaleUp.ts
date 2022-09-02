import { BooleanLiteral } from 'typescript';
import { Time, Vector3, Coroutine, WaitForSeconds, Random, Collider, GameObject, AnimationClip} from 'UnityEngine';
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
    public gesture:AnimationClip;
    private y:number=-12;
    
    private stun: bool;



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
            
        }

        if(this.transform.position.y < this.y){
            this.transform.position = this.originpos;
            this.transform.localScale = this.originscale;
            this.Time=0;
            this.checkTime=10;
        }
        
        
    }
    
    OnCollisionEnter(coll: Collider){
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.StopMoving();
            
            
                const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
                character.SetGesture(this.gesture);
                this.StartCoroutine(this.StopCharacterGesture(this.gesture.length - 0.6));
                
            
        }
    }
    *StopCharacterGesture(length:number){
        yield new WaitForSeconds(length);
        const character = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        character.CancelGesture();   
            
        }
        

    }




