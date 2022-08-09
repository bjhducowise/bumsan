import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {ZepetoWorldMultiplay} from 'ZEPETO.World'
import {Room, RoomData} from 'ZEPETO.Multiplay'
import {Player, State, Vector3, Transform} from 'ZEPETO.Multiplay.Schema'
import {CharacterState, SpawnInfo, ZepetoPlayers, ZepetoPlayer, LocalPlayer} from 'ZEPETO.Character.Controller'
import * as UnityEngine from "UnityEngine";
import UIController from '../../04 Boat/UIController'
import PlayerController from '../../04 Boat/PlayerController'
import Carpet from '../../04 Boat/Carpet'
import CharacterControllerSample from '../../04 Boat/CharacterControllerSample'

import * as MuiltiSchema from 'ZEPETO.Multiplay.Schema'
interface TeleportMessageModel {
    clientId: string,
    transform: Vector3
    }
export default class ClientStarter extends ZepetoScriptBehaviour {
    
    public multiplay: ZepetoWorldMultiplay;
    public ui : UnityEngine.GameObject;
    private room: Room;
    private currentPlayers: Map<string, Player> = new Map<string, Player>();
    //vehicle
    public carpetPrefab : UnityEngine.GameObject;

    private playerController : PlayerController;
    private uiController : UIController; 
    private carpetGo : UnityEngine.GameObject;
    private carpet : Carpet;
    private carpetOnOff : bool = false;
    private moveP : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);
    private boatCreatePoint : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);
    private testM : TeleportMessageModel;
    private Start() {
        var go = UnityEngine.Object.Instantiate<UnityEngine.GameObject>(this.ui);
        
        this.uiController = go.GetComponent<UIController>();
        this.multiplay.RoomCreated += (room: Room) => {
            this.room = room;
            room.AddMessageHandler("Teleport", (message: TeleportMessageModel) => {
                console.log(`TP session ID 11 : ${JSON.stringify(message)}`);
                //console.log(`${message.transform.position.x}//${message.transform.position.y}//${message.transform.position.z}`);
                console.log(`TP session ID : ${message.clientId}`);
                return ZepetoPlayers.instance.GetPlayer(message.clientId).character.Teleport(this.ParseVector3(message.transform),UnityEngine.Quaternion.identity)
            });
        };

        this.multiplay.RoomJoined += (room: Room) => {
            room.OnStateChange += this.OnStateChange;
        };

        this.StartCoroutine(this.SendMessageLoop(0.1));
    }
    

    // Send the local character transform to the server at the scheduled Interval Time.
    private* SendMessageLoop(tick: number) {
        while (true) {
            yield new UnityEngine.WaitForSeconds(tick);

            if (this.room != null && this.room.IsConnected) {
                const hasPlayer = ZepetoPlayers.instance.HasPlayer(this.room.SessionId);
                if (hasPlayer) {
                    const myPlayer = ZepetoPlayers.instance.GetPlayer(this.room.SessionId);
                    this.SendTransform(myPlayer.character.transform);
                    if(this.carpetOnOff) {
                        console.log(`vehicle is alive`)
                        //this.SendTransform(myPlayer.character.transform.parent.transform);
                        //this.SendTransform(myPlayer.character.transform);
                    }
                    else{
                        //this.SendTransform(myPlayer.character.transform);
                    } 
                }
            }
        }
    }
    FixedUpdate(){
        if(this.uiController){
            if(this.uiController.isdown&&this.carpetOnOff){
                this.carpet.Move(this.moveP);
            }
        }
        
    }
    private OnStateChange(state: State, isFirst: boolean) {

        // When the first OnStateChange event is received, a full state snapshot is recorded.
        if (isFirst) {

            // [CharacterController] (Local) Called when the Player instance is fully loaded in Scene
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                let _player : LocalPlayer = ZepetoPlayers.instance.LocalPlayer;
                this.playerController = _player.zepetoPlayer.character.gameObject.AddComponent<PlayerController>();
                
                this.uiController.HideCarpetButton();
                this.uiController.downAction = ()=>{

                    console.log(`[CreateCarpet] carpet : ${this.carpet}`);
                    if(this.carpet)
                        this.carpet.MoveStart();
                };
                
                this.uiController.dragAction = (dir)=>{
                    if(this.carpet) this.carpet.Move(dir);
                    console.log(`${dir}`)
                };
        
                this.uiController.upAction = ()=>{
                    if(this.carpet) this.carpet.MoveStop();
                };
                this.uiController.carpetBtn.onClick.AddListener(()=>{
                    this.carpetOnOff = !this.carpetOnOff;
                    if(this.carpetOnOff){
                        this.boatCreatePoint =_player.zepetoPlayer.character.transform.position;
                        //this.r_Teleport(new UnityEngine.Vector3(this.boatCreatePoint.x,-11.5,this.boatCreatePoint.y));
                        console.log(`boat Point 1 : ${this.boatCreatePoint.x} ${this.boatCreatePoint.y} ${this.boatCreatePoint.z}`);
                        _player.StopMoving();
                        this.CreateCarpet(this.playerController.gameObject.transform.position);
                        this.playerController.Ride(this.carpet);
                        this.sendIsRide(this.carpetOnOff);
                        this.SendTransform(myPlayer.character.transform);
                        
                    }
                    if(!this.carpetOnOff){
                        ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.transform.position =(new UnityEngine.Vector3(this.carpetGo.transform.position.x,0,this.carpetGo.transform.position.z));
                        this.carpetGo.transform.DetachChildren();
                        this.playerController.offController();
                        this.sendIsRide(this.carpetOnOff);
                        UnityEngine.GameObject.Destroy(this.carpetGo);
                        console.log(`boat Point 2 : ${this.boatCreatePoint.x} ${this.boatCreatePoint.y} ${this.boatCreatePoint.z}`);
                        _player.zepetoPlayer.character.Teleport(this.boatCreatePoint,_player.zepetoPlayer.character.transform.rotation);
                        //this.r_Teleport(this.boatCreatePoint);
                        _player.zepetoPlayer.character.StopMoving();
                        this.SendTransform(myPlayer.character.transform);
                    }
                    
                    
                });
                myPlayer.character.OnChangedState.AddListener((cur, prev) => {
                    this.SendState(cur);
                });
            });

            // [CharacterController] Called when the Player instance is fully loaded in Scene
            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
                const isLocal = this.room.SessionId === sessionId;
                if (!isLocal) {
                    const player: Player = this.currentPlayers.get(sessionId);
                    let _player = ZepetoPlayers.instance.GetPlayer(sessionId);
                    _player.character.gameObject.AddComponent<CharacterControllerSample>();
                    
                    // [RoomState] Called whenever the state of the player instance is updated. 
                    player.OnChange += (changeValues) => this.OnUpdatePlayer(sessionId, player);
                }
            });
        }

        let join = new Map<string, Player>();
        let leave = new Map<string, Player>(this.currentPlayers);

        state.players.ForEach((sessionId: string, player: Player) => {
            if (!this.currentPlayers.has(sessionId)) {
                join.set(sessionId, player);
            }
            leave.delete(sessionId);
        });

        // [RoomState] Create a player instance for players that enter the Room
        join.forEach((player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player));

        // [RoomState] Remove the player instance for players that exit the room
        leave.forEach((player: Player, sessionId: string) => this.OnLeavePlayer(sessionId, player));
    }

    private OnJoinPlayer(sessionId: string, player: Player) {
        console.log(`[OnJoinPlayer] players - sessionId : ${sessionId}`);
        this.currentPlayers.set(sessionId, player);

        const spawnInfo = new SpawnInfo();
        const position = this.ParseVector3(player.transform.position);
        const rotation = this.ParseVector3(player.transform.rotation);
        spawnInfo.position = position;
        spawnInfo.rotation = UnityEngine.Quaternion.Euler(rotation);

        const isLocal = this.room.SessionId === player.sessionId;
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.zepetoUserId, spawnInfo, isLocal);
    }

    private OnLeavePlayer(sessionId: string, player: Player) {
        console.log(`[OnRemove] players - sessionId : ${sessionId}`);
        this.currentPlayers.delete(sessionId);

        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }
    private OnUpdatePlayer(sessionId: string, player: Player) {

        const position = this.ParseVector3(player.transform.position);

        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        let _player = ZepetoPlayers.instance.GetPlayer(player.sessionId);
        console.log(`${_player.character.gameObject.transform.name}`);
        
        if(player.isRide&&_player.character.gameObject.transform.parent==null){
            
            _player.character.StopMoving();
            var obj = UnityEngine.GameObject.Instantiate(this.carpetPrefab,new UnityEngine.Vector3(_player.character.transform.position.x,_player.character.transform.position.y,_player.character.transform.position.z),_player.character.transform.rotation) as UnityEngine.GameObject;
            _player.character.Teleport(new UnityEngine.Vector3(_player.character.transform.position.x,_player.character.transform.position.y,_player.character.transform.position.z),_player.character.transform.rotation);
            _player.character.transform.transform.SetParent(obj.transform);
            obj.AddComponent<Carpet>();
            _player.character.enabled = false;
            console.log(`hiiii`);
            obj.transform.position=position;
            //obj.transform.position.y = -11.5;
        }
        else if(!player.isRide&&(_player.character.gameObject.transform.parent!=null)){
            _player.character.enabled = true;
            var _playerParent = _player.character.gameObject.transform.parent.gameObject;
            _player.character.transform.parent.transform.DetachChildren();
            UnityEngine.GameObject.Destroy(_playerParent);
            this.StopCoroutine(this.moveVehicle);
            
            
        }
        
        if(player.isRide&&_player.character.gameObject.transform.parent!=null) {
            if(zepetoPlayer.character.transform.parent.transform.position.y>-10)zepetoPlayer.character.transform.parent.transform.position=position;
            else this.StartCoroutine(this.moveVehicle(player.isRide,zepetoPlayer.character.transform.parent.gameObject,zepetoPlayer.character.transform.parent.position,position));
            zepetoPlayer.character.transform.parent.transform.rotation = UnityEngine.Quaternion.Euler(this.ParseVector3(player.transform.rotation));
            
            
        }
        else zepetoPlayer.character.MoveToPosition(position);
        if(!player.isRide) this.StopCoroutine(this.moveVehicle);
        if (player.state === CharacterState.JumpIdle || player.state === CharacterState.JumpMove)
            zepetoPlayer.character.Jump();
    }
    private *moveVehicle(isRide : boolean , vehilceObj : UnityEngine.GameObject,startPos : UnityEngine.Vector3 , endPos : UnityEngine.Vector3){
        if(vehilceObj!=null){
            var dir = endPos.z-vehilceObj.transform.position.z;
            dir/60;
            var i = 1;
            vehilceObj.transform.position=UnityEngine.Vector3.Lerp(startPos,endPos,0.1/60);
        }
       
        /*
        while(i<61){
            if(vehilceObj==null) return null;
            if(vehilceObj!=null) vehilceObj.transform.position=UnityEngine.Vector3.Lerp(startPos,endPos,0.1/60);
            yield new UnityEngine.WaitForSecondsRealtime(0.1/60);
            if(!isRide) yield null;
        }
        yield null;*/
         
        yield new UnityEngine.WaitForSecondsRealtime(0.1/60);
    }
    private SendTransform(transform: UnityEngine.Transform) {
        const data = new RoomData();

        const pos = new RoomData();
        pos.Add("x", transform.position.x);
        pos.Add("y", transform.position.y);
        pos.Add("z", transform.position.z);
        data.Add("position", pos.GetObject());

        const rot = new RoomData();
        rot.Add("x", transform.localEulerAngles.x);
        rot.Add("y", transform.localEulerAngles.y);
        rot.Add("z", transform.localEulerAngles.z);
        data.Add("rotation", rot.GetObject());
        this.room.Send("onChangedTransform", data.GetObject());
    }

    private SendState(state: CharacterState) {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }
    private sendIsRide(isRideS : bool){
        const data = new RoomData();
        data.Add("isRide", isRideS);
        this.room.Send("isRideState", data.GetObject());
    }
    private ParseVector3(vector3: Vector3): UnityEngine.Vector3 {
        return new UnityEngine.Vector3
        (
            vector3.x,
            vector3.y,
            vector3.z
        );
    }
    private makeSchemaTransform(transform : UnityEngine.Transform){
        const schemasTransform = new Transform();
        schemasTransform.position = new Vector3();
        schemasTransform.position.x = transform.position.x;
        schemasTransform.position.y = transform.position.y;
        schemasTransform.position.z = transform.position.z;

        schemasTransform.rotation = new Vector3();
        schemasTransform.rotation.x = transform.rotation.x;
        schemasTransform.rotation.y = transform.rotation.y;
        schemasTransform.rotation.z = transform.rotation.z;
        return schemasTransform;

    }
    private CreateCarpet(pos : UnityEngine.Vector3)
    {
        this.carpetGo = UnityEngine.Object.Instantiate(this.carpetPrefab, new UnityEngine.Vector3(pos.x,-12.5,pos.z), UnityEngine.Quaternion.identity ) as UnityEngine.GameObject;
        
        console.log(`[CreateCarpet] carpetGo : ${this.carpetGo}`);
        
        this.carpet = this.carpetGo.AddComponent<Carpet>();

        console.log(`[CreateCarpet] carpet : ${this.carpet}`);
        this.uiController.dragAction = (dir)=>{
            this.moveP = new UnityEngine.Vector3(dir.x*15*UnityEngine.Time.deltaTime,dir.y*15*UnityEngine.Time.deltaTime,dir.z);
        };

        
    }
    public clientShowCarpetButton(){
        this.uiController.ShowCarpetButton();
    }
    public clientHideCarpetButton(){
        this.uiController.HideCarpetButton();
    }
    public carpetOff(){
        this.carpetOnOff = false;
        ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.transform.position =(new UnityEngine.Vector3(this.carpetGo.transform.position.x,0,this.carpetGo.transform.position.z));
        this.carpetGo.transform.DetachChildren();
        this.playerController.offController();
        this.sendIsRide(this.carpetOnOff);
        UnityEngine.GameObject.Destroy(this.carpetGo);
    }
    
}
