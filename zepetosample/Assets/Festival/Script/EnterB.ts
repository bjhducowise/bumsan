import { Collider, GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import BGM from './BGM'

export default class EnterB extends ZepetoScriptBehaviour {

    public script:GameObject;

    OnTriggerEnter(coll:Collider){
        var audio = this.script.GetComponent<BGM>();
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            if(!audio.isA2Play){
                audio.isA1Play=false;
                audio.isA2Play=true;
                audio.isA3Play=false;
                audio.PlayAudio();
            }
            
            
        }

    }

}