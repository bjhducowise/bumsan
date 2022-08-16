import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from 'ZEPETO.Character.Controller'
import PlayerController from "./PlayerController"
import {GameObject, Object, Vector3, Quaternion, WaitUntil, Time } from "UnityEngine";
//import UIController from "./UIController"
import Carpet from "./Carpet"
import UIController from './UIController';
import * as UnityEngine from "UnityEngine";
export default class CharacterControllerSample extends ZepetoScriptBehaviour {

    private playerController : PlayerController;
    private uiController : UIController;
    public carpetPrefab : GameObject;
    private carpetGo : GameObject;
    private carpet : Carpet;
    private carpetOnOff : bool = false;
    private moveP : Vector3 = new Vector3(0,0,0);
    Start() {
        
    }
    public setCarpet(sessionId : string){
        let _player = ZepetoPlayers.instance.GetPlayer(sessionId);
        this.playerController = _player.character.gameObject.AddComponent<PlayerController>();
        this.CreateCarpet(this.playerController.gameObject.transform.position);
        this.playerController.Ride(this.carpet);
    }
    public offCarpet(sessionId : string){
        ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject.transform.position =(new UnityEngine.Vector3(this.carpetGo.transform.position.x,this.carpetGo.transform.position.y,0));
        this.carpetGo.transform.DetachChildren();
        this.playerController.offController();
        UnityEngine.GameObject.Destroy(this.carpetGo);
    }
    Update(){
        if(this.carpetOnOff){
            this.carpet.Move(this.moveP);
        }
    }
    private CreateCarpet(pos : Vector3)
    {
        this.carpetGo = Object.Instantiate(this.carpetPrefab, pos, Quaternion.identity ) as GameObject;
        
        console.log(`[CreateCarpet] carpetGo : ${this.carpetGo}`);
        
        this.carpet = this.carpetGo.AddComponent<Carpet>();

        console.log(`[CreateCarpet] carpet : ${this.carpet}`);
        this.uiController.dragAction = (dir)=>{
            this.moveP = new Vector3(dir.x*15*Time.deltaTime,dir.y*15*Time.deltaTime,dir.z);
        };

        
    }

}