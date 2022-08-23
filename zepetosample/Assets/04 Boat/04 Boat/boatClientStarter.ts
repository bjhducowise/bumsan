import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {ZepetoWorldMultiplay} from 'ZEPETO.World'
import {Room, RoomData} from 'ZEPETO.Multiplay'
import {Player, State, Vector3,Transform} from 'ZEPETO.Multiplay.Schema'
import {CharacterState, SpawnInfo, ZepetoPlayers, ZepetoPlayer, LocalPlayer} from 'ZEPETO.Character.Controller'
import * as UnityEngine from "UnityEngine";
import PlayerController from './PlayerController'
import UIController from './UIController'
import Carpet from './Carpet'
import CharacterControllerSample from './CharacterControllerSample'
export default class boatClientStarter extends ZepetoScriptBehaviour {
    public multiplay: ZepetoWorldMultiplay;
    private room: Room;
    private currentPlayers: Map<string, Player> = new Map<string, Player>();
//add
    public ui : UnityEngine.GameObject;
    public carpetPrefab : UnityEngine.GameObject;
    public boatHeight : float;
    public gesture:UnityEngine.AnimationClip;
    //플레이어 위치 바꿀 때 사용 
    public Playerpos:UnityEngine.Vector3;
    private playerController : PlayerController;
    private uiController : UIController; 
    private carpetGo : UnityEngine.GameObject;
    private carpet : Carpet;
    private carpetOnOff : bool = false;
    private isMove : bool = false;
    private moveP : UnityEngine.Vector3 = new UnityEngine.Vector3(0,0,0);
    public boatCreatePoint : UnityEngine.Vector3 = new UnityEngine.Vector3(3,-18,-3.8);
    private posThreshold: number =2;
    private Start() {
        var go = UnityEngine.Object.Instantiate<UnityEngine.GameObject>(this.ui);
        this.uiController = go.GetComponent<UIController>();

        this.multiplay.RoomCreated += (room: Room) => {
            this.room = room;
        };

        this.multiplay.RoomJoined += (room: Room) => {
            room.OnStateChange += this.OnStateChange;
            room.AddMessageHandler("onChangedTransform",(message:Transform)=>{
                var global=ZepetoPlayers.instance.GetPlayer(message.clientId).character;
                var local = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;

                ZepetoPlayers.instance.GetPlayer(message.clientId).character.Teleport(this.ParseVector3(message.position),new UnityEngine.Quaternion(message.rotation.x,message.rotation.y,message.rotation.z,1));
                ZepetoPlayers.instance.GetPlayer(message.clientId).character.transform.SetPositionAndRotation(this.ParseVector3(message.position),new UnityEngine.Quaternion(message.rotation.x,message.rotation.y,message.rotation.z,1));

                if(UnityEngine.Vector3.op_Equality(global.transform.position,local.transform.position)){
                    local.Teleport(global.transform.position,global.transform.rotation);
                }

            })
        };
        //this.Playerpos=ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform.localPosition;
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
    FixedUpdate(){//add
        if(this.uiController){
            if(this.uiController.isdown&&this.carpetOnOff){
                this.carpet.Move(this.moveP);
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
                        //플레이어 위치 수정 
                        //this.setPlayerpos(_player.zepetoPlayer.character.transform.localPosition);
                        _player.zepetoPlayer.character.transform.localPosition= UnityEngine.Vector3.op_Subtraction(_player.zepetoPlayer.character.transform.localPosition,this.Playerpos);
                        
                        
                    }
                    if(!this.carpetOnOff){
                        ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.transform.position =(new UnityEngine.Vector3(this.carpetGo.transform.position.x,0,this.carpetGo.transform.position.z));
                        this.carpetGo.transform.DetachChildren();
                        this.playerController.offController();
                        this.sendIsRide(this.carpetOnOff);
                        UnityEngine.GameObject.Destroy(this.carpetGo);
                        console.log(`boat Point 2 : ${this.boatCreatePoint.x} ${this.boatCreatePoint.y} ${this.boatCreatePoint.z}`);
                        _player.zepetoPlayer.character.Teleport(this.boatCreatePoint, _player.zepetoPlayer.character.transform.rotation);
                        //this.r_Teleport(this.boatCreatePoint);
                        //_player.zepetoPlayer.character.StopMoving();
                        //수정
                        //_player.zepetoPlayer.character.SetGesture(this.gesture);
                        this.carpetOff();
                    }
                    
                    
                });
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
                    let _player = ZepetoPlayers.instance.GetPlayer(sessionId);//add
                    _player.character.gameObject.AddComponent<CharacterControllerSample>();//add

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
        const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);

        //add
        let _player = ZepetoPlayers.instance.GetPlayer(player.sessionId);
        console.log(`${_player.character.gameObject.transform.name}`);
        
        if(player.isRide&&_player.character.gameObject.transform.parent==null){
            
            _player.character.StopMoving();
            //y값 수정
            var obj = UnityEngine.GameObject.Instantiate(this.carpetPrefab,new UnityEngine.Vector3(_player.character.transform.position.x,_player.character.transform.position.y,_player.character.transform.position.z),_player.character.transform.rotation) as UnityEngine.GameObject;
            _player.character.transform.transform.SetParent(obj.transform);
            obj.AddComponent<Carpet>();
            _player.character.enabled = false;
            //obj.transform.position.y = -11.5;
        }
        else if(!player.isRide&&(_player.character.gameObject.transform.parent!=null)){
            _player.character.enabled = true;
            var _playerParent = _player.character.gameObject.transform.parent.gameObject;
            _player.character.transform.parent.transform.DetachChildren();
            UnityEngine.GameObject.Destroy(_playerParent);
            this.StopCoroutine(this.moveVehicle);
            this.isMove = false;
            
        }
        
        if(player.isRide&&_player.character.gameObject.transform.parent!=null) {
            zepetoPlayer.character.transform.parent.transform.rotation = UnityEngine.Quaternion.Euler(this.ParseVector3(player.transform.rotation));
            if(zepetoPlayer.character.transform.parent.transform.position.y==this.boatHeight) this.StartCoroutine(this.moveVehicle(player.isRide,zepetoPlayer.character.transform.parent.gameObject,zepetoPlayer.character.transform.parent.position,position));
            else
            zepetoPlayer.character.transform.parent.transform.position=position;
        }else if(UnityEngine.Vector3.Distance(zepetoPlayer.character.transform.position,position)>this.posThreshold){
            console.log("distance",player.gestureState,UnityEngine.Vector3.Distance(zepetoPlayer.character.transform.position,position));
            zepetoPlayer.character.transform.position=position;
            zepetoPlayer.character.transform.rotation=UnityEngine.Quaternion.Euler(rotation);        
        }else zepetoPlayer.character.MoveToPosition(position);
        if(!player.isRide) this.StopCoroutine(this.moveVehicle);

        //-------------

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
    private sendIsRide(isRideS : bool){//add
        const data = new RoomData();
        data.Add("isRide", isRideS);
        this.room.Send("isRideState", data.GetObject());
    }
    private CreateCarpet(pos : UnityEngine.Vector3)//add
    {
        this.carpetGo = UnityEngine.Object.Instantiate(this.carpetPrefab, new UnityEngine.Vector3(pos.x,this.boatHeight,pos.z), UnityEngine.Quaternion.identity ) as UnityEngine.GameObject;
        
        console.log(`[CreateCarpet] carpetGo : ${this.carpetGo}`);
        
        this.carpet = this.carpetGo.AddComponent<Carpet>();

        console.log(`[CreateCarpet] carpet : ${this.carpet}`);
        this.uiController.dragAction = (dir)=>{
            this.moveP = new UnityEngine.Vector3(dir.x*15*UnityEngine.Time.deltaTime,dir.y*15*UnityEngine.Time.deltaTime,dir.z);
        };

        
    }
    public clientShowCarpetButton(){//add
        this.uiController.ShowCarpetButton();
    }
    public clientHideCarpetButton(){//add
        this.uiController.HideCarpetButton();
    }
    public carpetOff(){//add
        this.carpetOnOff = false;
        ZepetoPlayers.instance.GetPlayerWithUserId(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId).character.gameObject.transform.position =(new UnityEngine.Vector3(this.carpetGo.transform.position.x,0,this.carpetGo.transform.position.z));
        this.carpetGo.transform.DetachChildren();
        this.playerController.offController();
        this.sendIsRide(this.carpetOnOff);
        console.log("carpet name" , this.carpetGo.name);
        UnityEngine.GameObject.Destroy(this.carpetGo);
    }
    private ParseVector3(vector3: Vector3): UnityEngine.Vector3 {
        return new UnityEngine.Vector3
        (
            vector3.x,
            vector3.y,
            vector3.z
        );
    }
    
    public customTeleport(p:UnityEngine.Vector3,r:UnityEngine.Quaternion){
        if(this.room){
            const data = new RoomData();
            const pos = new RoomData();
            pos.Add("x",p.x);
            pos.Add("y",p.y);
            pos.Add("z",p.z);
            data.Add("position",pos.GetObject());

            const rot=new RoomData();
            rot.Add("x",r.x);
            rot.Add("y",r.y);
            rot.Add("z",r.z);
            data.Add("rotation",rot.GetObject());
            this.room.Send("onTeleport",data.GetObject());
            
        }
    }
    public setPlayerpos(position:UnityEngine.Vector3){
        this.Playerpos=position;
    }
    
}