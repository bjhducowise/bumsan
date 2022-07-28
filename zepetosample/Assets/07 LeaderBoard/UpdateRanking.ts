import { CharacterController, Collider, GameObject } from 'UnityEngine';
import { MaskableGraphic } from 'UnityEngine.UI';
import { Vector3 } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ClientStarter from '../Multiplay/ClientStarter';
import {Text} from 'UnityEngine.UI'
import SetScoreExample from './SetScoreExample';

var cs;
export default class UpdateRanking extends ZepetoScriptBehaviour {

   
    
    public text: GameObject;
    public clientStarter:GameObject;
    OnTriggerEnter(coll: Collider)
    {
        if(coll.GetComponent<CharacterController>() != null)
        {
            //SetScoreExample.getInstance().Init();
            //cs = this.clientStarter.GetComponent<ClientStarter>();
            //cs.updateRankingBoard(this.text.GetComponent<Text>());

            SetScoreExample.getInstance().updateRankingBoard();
        }
    }

}