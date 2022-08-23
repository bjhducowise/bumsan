import { LocalPlayer, ZepetoCharacter, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import * as UnityEngine from "UnityEngine";
import UIController from './UIController';
import boatClientStarter from './boatClientStarter';
import PlayerController from './PlayerController';
export default class VehicleSystem extends ZepetoScriptBehaviour {

    private clientstarter : boatClientStarter;
    @Header("Custom UI Prefab")
    public ui : UnityEngine.GameObject;
    private uiController : UIController; 

    @Header("Vehicle Object")
    public vehiclePrefab : UnityEngine.GameObject;
    public vehicleInstantiateWeight : UnityEngine.Vector3;
    private vehilceInstanteObject : UnityEngine.GameObject;
    private vehicleOnOff : bool = false;
    private vehicleCreatePoint : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);
    
    private _player : LocalPlayer;
    private playerController : PlayerController;
    Start() {    
        var go = UnityEngine.Object.Instantiate<UnityEngine.GameObject>(this.ui);
        this.uiController = go.GetComponent<UIController>();
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            //this.uiController.hideVehicleButton();
            this._player = ZepetoPlayers.instance.LocalPlayer;
            this.playerController = this._player.zepetoPlayer.character.gameObject.AddComponent<PlayerController>();
            this.uiController.vehicleGenerateBtn.onClick.AddListener(()=>{
            this.clientstarter = this.gameObject.GetComponent<boatClientStarter>();
            this.vehicleOnOff = !this.vehicleOnOff;
            
            if(this.vehicleOnOff){
                this.vehicleCreatePoint =this._player.zepetoPlayer.character.transform.position;
                this._player.StopMoving();
                var instantiateVector = this._player.zepetoPlayer.character.gameObject.transform.position;
                instantiateVector = instantiateVector+this.vehicleInstantiateWeight;
                this.vehilceInstanteObject = this.createVehicleClient(instantiateVector,UnityEngine.Quaternion.identity);
                this._player.zepetoPlayer.character.gameObject.GetComponent<UnityEngine.CharacterController>().enabled =false;
                this._player.zepetoPlayer.character.gameObject.GetComponent<ZepetoCharacter>().enabled =false;
                this._player.zepetoPlayer.character.gameObject.transform.position = this.vehilceInstanteObject.transform.position;
                this._player.zepetoPlayer.character.gameObject.transform.SetParent(this.vehilceInstanteObject.transform);
                //this.playerController.Ride(this.carpet)
                this.clientstarter.sendIsRide(this.vehicleOnOff);//clientstarter
                
            }
            if(!this.vehicleOnOff){
                ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.transform.position =(new UnityEngine.Vector3(this.vehilceInstanteObject.transform.position.x,0,this.vehilceInstanteObject.transform.position.z));
                this.vehilceInstanteObject.transform.DetachChildren();
                this.playerController.offController();
                this.clientstarter.sendIsRide(this.vehicleOnOff);
                UnityEngine.GameObject.Destroy(this.vehilceInstanteObject);
                this._player.zepetoPlayer.character.Teleport(this.vehicleCreatePoint,this._player.zepetoPlayer.character.transform.rotation);
                this._player.zepetoPlayer.character.StopMoving();
            }
        });
        });
        
    }
    private createVehicleClient(pos : UnityEngine.Vector3, rot : UnityEngine.Quaternion)//add
    {
        return UnityEngine.Object.Instantiate(this.vehiclePrefab, pos, rot ) as UnityEngine.GameObject;
    }
    public createVehicleServer(pos : UnityEngine.Vector3, rot : UnityEngine.Quaternion)//add
    {
        return UnityEngine.Object.Instantiate(this.vehiclePrefab, pos, rot ) as UnityEngine.GameObject;
    }
    public clientShowVehicleButton(){//add
        this.uiController.showVehicleButton();
    }
    public clientHideVehicleButton(){//add
        this.uiController.hideVehicleButton();
    }

}