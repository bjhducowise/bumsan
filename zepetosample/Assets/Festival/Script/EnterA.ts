import { Collider, GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import BGM from './BGM'

export default class EnterA extends ZepetoScriptBehaviour {

    public script:GameObject;

    OnTriggerEnter(coll:Collider){
        var audio = this.script.GetComponent<BGM>();
        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            if(!audio.isA1Play){
                audio.isA1Play=true;
                audio.isA2Play=false;
                audio.isA3Play=false;
                audio.PlayAudio();
            }
        }
    }
}