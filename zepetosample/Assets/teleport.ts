import { Collider, Color, GameObject, Material, Mesh, MeshRenderer, Quaternion} from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoCharacter,ZepetoPlayer,ZepetoPlayers } from 'ZEPETO.Character.Controller';
import QuarterViewController from './ZepetoScripts/QuarterView/QuarterViewController';
import ClientStarter from './ZepetoScripts/Multiplay/ClientStarter';
import { ThemeStyleSheet } from 'UnityEngine.UIElements';
import {Vector3} from 'ZEPETO.Multiplay.Schema'

export default class teleport extends ZepetoScriptBehaviour {
    
    

    public oj:GameObject;
    public targetpoint : GameObject;
    private zepetoCharacter: ZepetoCharacter;
    public mat:Material;
    private clone: GameObject;
    public cs:GameObject;
    
    
    Start() 
    {    
        //Zepeto character object
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.zepetoCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
        });   
    }  


    OnTriggerEnter(coll:Collider){

        if(coll.gameObject.name==ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.name){
            this.clone = GameObject.Instantiate(this.oj,this.oj.transform.position,this.oj.transform.rotation) as GameObject;
            this.clone.transform.position = this.targetpoint.transform.position;
           
            this.Invoke("playerTeleport",1.5);
        }
       
     }

    playerTeleport(){
        this.zepetoCharacter.Teleport(this.targetpoint.transform.position,Quaternion.identity);
        this.cs.GetComponent<ClientStarter>().r_Teleport(this.targetpoint.transform.position);

    }
    
    

    
    
}