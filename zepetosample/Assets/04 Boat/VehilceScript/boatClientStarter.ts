import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {ZepetoWorldMultiplay} from 'ZEPETO.World'
import {Room, RoomData} from 'ZEPETO.Multiplay'
import {Player, State, Vector3} from 'ZEPETO.Multiplay.Schema'
import {CharacterState, SpawnInfo, ZepetoPlayers, ZepetoPlayer, LocalPlayer, ZepetoCharacter} from 'ZEPETO.Character.Controller'
import * as UnityEngine from "UnityEngine";
import VehicleSystem from './VehicleSystem'
export default class boatClientStarter extends ZepetoScriptBehaviour {
    @Header("Zepeto Multiplay")
    public multiplay: ZepetoWorldMultiplay;

    @Header("Move Point Threshold")
    public posThreshold : float = 5;

    private room: Room;
    private currentPlayers: Map<string, Player> = new Map<string, Player>();
    private vehicleSystem : VehicleSystem;

    private Start() {
        this.multiplay.RoomCreated += (room: Room) => {
            this.room = room;
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
                    this.SendTransform(myPlayer.character.transform);//add
                }
            }
        }
    }
    private OnStateChange(state: State, isFirst: boolean) {

        // When the first OnStateChange event is received, a state full snapshot is received.
        if (isFirst) {

            // [CharacterController] (Local) Called when the Player instance is fully loaded in Scene
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                //add
                this.vehicleSystem = this.gameObject.GetComponent<VehicleSystem>();
                //--------------------
                myPlayer.character.OnChangedState.AddListener((cur, prev) => {
                    this.SendState(cur);
                });
            });

            // [CharacterController] Called when the Player instance is fully loaded in Scene
            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
                const isLocal = this.room.SessionId === sessionId;
                if (!isLocal) {
                    const player: Player = this.currentPlayers.get(sessionId);
                    // Called whenever the state of the [RoomState] player instance is updated.
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

        // [RoomState] Create a player instance that entered the Room
        join.forEach((player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player));

        // [RoomState] Remove exited player instance from Room
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
        if(player.isRide){
            var veh = ZepetoPlayers.instance.GetPlayerWithUserId(player.zepetoUserId).character.gameObject.transform.parent.gameObject;
            veh.transform.DetachChildren();
            UnityEngine.GameObject.Destroy(veh);
        } 
        this.currentPlayers.delete(sessionId);

        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }

    private OnUpdatePlayer(sessionId: string, player: Player) {

        const position = this.ParseVector3(player.transform.position);
        const rotation = this.ParseVector3(player.transform.rotation);
        console.log(`position :`, position );

        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        let _player = ZepetoPlayers.instance.GetPlayer(player.sessionId);

        if (UnityEngine.Vector3.Distance(zepetoPlayer.character.transform.position, position) > this.posThreshold) {
            zepetoPlayer.character.transform.position = position;
            zepetoPlayer.character.transform.rotation = UnityEngine.Quaternion.Euler(rotation);
        }
        //add
        if(player.isRide&&_player.character.gameObject.transform.parent==null){
            
            _player.character.StopMoving();
            var obj =this.vehicleSystem.createVehicleServer(_player.character.transform.position,_player.character.transform.rotation);
            _player.character.transform.transform.SetParent(obj.transform);
            _player.character.enabled = false;
        }
        else if(!player.isRide&&(_player.character.gameObject.transform.parent!=null)){
            _player.character.enabled = true;
            var _playerParent = _player.character.gameObject.transform.parent.gameObject;
            _player.character.transform.parent.transform.DetachChildren();
            UnityEngine.GameObject.Destroy(_playerParent);
            this.StopCoroutine(this.moveVehicle);
            
        }
        
        else if(player.isRide&&_player.character.gameObject.transform.parent!=null) {
            _player.character.gameObject.transform.parent.transform.rotation = UnityEngine.Quaternion.Euler(rotation);
            this.StartCoroutine(this.moveVehicle(player.isRide,zepetoPlayer.character.transform.parent.gameObject,zepetoPlayer.character.transform.parent.position,position));
        }
        else zepetoPlayer.character.MoveToPosition(position);
        if(!player.isRide) this.StopCoroutine(this.moveVehicle);

        if (player.state === CharacterState.JumpIdle || player.state === CharacterState.JumpMove)
            zepetoPlayer.character.Jump();
    }
    private *moveVehicle(isRide : boolean , vehilceObj : UnityEngine.GameObject,startPos : UnityEngine.Vector3 , endPos : UnityEngine.Vector3){//add
        var dpos = new UnityEngine.Vector3(endPos.x-startPos.x,endPos.y-startPos.y,endPos.z-startPos.z);
        var cPos = startPos;
        if(vehilceObj!=null){
            var i = 0;
            while(i<6){
                cPos.x +=dpos.x/6;
                cPos.y +=dpos.y/6;
                cPos.z +=dpos.z/6;
                vehilceObj.transform.position = cPos;
                i+=1;
                yield new UnityEngine.WaitForSecondsRealtime(UnityEngine.Time.deltaTime);
            }
        }
    }
    private SendTransform(transform: UnityEngine.Transform) {
        const data = new RoomData();

        const pos = new RoomData();
        pos.Add("x", transform.position.x);
        pos.Add("y", transform.position.y);
        pos.Add("z", transform.position.z);
        data.Add("position", pos.GetObject());

        const rot = new RoomData();
        rot.Add("x", transform.eulerAngles.x);
        rot.Add("y", transform.eulerAngles.y);
        rot.Add("z", transform.eulerAngles.z);
        data.Add("rotation", rot.GetObject());
        this.room.Send("onChangedTransform", data.GetObject());
    }

    private SendState(state: CharacterState) {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }
    public sendIsRide(isRideS : bool){//add
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

}