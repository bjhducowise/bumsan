import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {PlayerInput,InputAction} from "UnityEngine.InputSystem"
import {CallbackContext} from "UnityEngine.InputSystem.InputAction"
import {CharacterState, ZepetoCharacter, ZepetoPlayers, ZepetoCamera} from 'ZEPETO.Character.Controller'
import {Quaternion, Time, Vector2, Vector3} from "UnityEngine";
import * as UnityEngine from "UnityEngine";
import * as UnityEngineUI from "UnityEngine.UI";

export default class SideViewController extends ZepetoScriptBehaviour {

    public cameraParent : UnityEngine.GameObject;
    public customCamera : UnityEngine.Camera;
    public cameraDistance : number = 10;

    private originSpawnPoint : Vector3 = new Vector3(-16,-5,0);
    private myCharacter: ZepetoCharacter;
    private startPos: Vector2 = Vector2.zero;
    private curPos: Vector2 = Vector2.zero;

    private playerInput: PlayerInput;
    private touchPositionAction : InputAction;
    private touchTriggerAction : InputAction;

    private isTriggered: boolean = false;
    private isTouchDown: boolean = false;

    private camTouch : InputAction;
    private camTouchTrigger : InputAction;

    private isCamTriggered : boolean = false;
    private isCamTouchDown : boolean = false;

    private camStartPos: Vector2 = Vector2.zero;
    private camCurPos: Vector2 = Vector2.zero;

    private cameraAngleX : float = 0;
    private cameraAngleY : float = 0;

    
    private playerMoveDir : UnityEngine.Vector2 = Vector2.zero;
    private cameraMoveDir : UnityEngine.Vector2 = Vector2.zero;
    
    private isPlayerMove : boolean = false;
    private isCameraMove : boolean = false;
    private CanMove() : boolean {
        return this.isTouchDown && !this.isTriggered;
    }
    private cameraCanMove() : boolean {
        return this.isCamTouchDown && !this.isCamTriggered;
    }

    OnEnable(){
        //this.playerInput = this.gameObject.GetComponent<PlayerInput>();
    }

    Start() {
        this.playerInput = this.gameObject.GetComponent<PlayerInput>();
        this.touchTriggerAction = this.playerInput.actions.FindAction("MoveTrigger");
        this.touchPositionAction = this.playerInput.actions.FindAction("Move");
        this.camTouch = this.playerInput.actions.FindAction("cameraInput");//cameraTrigger
        this.camTouchTrigger = this.playerInput.actions.FindAction("cameraTrigger");
        this.touchTriggerAction.add_started((context)=>{
            this.isTriggered = true;
            this.isTouchDown = true;
        });

        this.touchTriggerAction.add_canceled((context)=>{
            this.isTriggered = false;
            this.isTouchDown = false;
        });

        this.touchPositionAction.add_performed((context)=>{

            if(this.isTouchDown)
            {
                this.curPos = context.ReadValueAsObject() as Vector2;
                if(this.isTriggered) {
                    this.isTriggered = false;
                    this.startPos = this.curPos;
                }
            }
        });
        this.camTouchTrigger .add_started((context)=>{
            this.isCamTriggered = true;
            this.isCamTouchDown = true;
        })
        this.camTouchTrigger.add_canceled((context)=>{
            this.isCamTriggered = false;
            this.isCamTouchDown = false;
        });
        this.camTouch.add_performed((context)=>{
            var cCurPos = context.ReadValueAsObject() as Vector2;
            if(this.isCamTouchDown)
            {
                this.camCurPos = context.ReadValueAsObject() as Vector2;
                if(this.isCamTriggered) {
                    this.isCamTriggered = false;
                    this.camStartPos = this.camCurPos;
                }
            }
            
        });
        //turn off zepeto camera
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            ZepetoPlayers.instance.LocalPlayer.zepetoCamera.gameObject.SetActive(false);
            this.myCharacter = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
            let characterPos = this.myCharacter.transform.position;
            this.cameraParent.transform.position = new Vector3(characterPos.x, characterPos.y + 1, characterPos.z);
            this.customCamera.transform.position = new Vector3(characterPos.x, characterPos.y + 1, characterPos.z-this.cameraDistance);
            this.cameraAngleX = this.customCamera.transform.rotation.eulerAngles.x;
            this.cameraAngleY = this.customCamera.transform.rotation.eulerAngles.y;
            this.StartCoroutine(this.InputControlLoop());
        });
    }
    private *InputControlLoop(){
        while(true)
        {
            yield new UnityEngine.WaitForEndOfFrame();
            
            if (this.myCharacter) {
                if(this.startPos.x<UnityEngine.Screen.width/2&&this.CanMove()) {
                    this.playerMoveDir=Vector2.op_Subtraction(this.curPos, this.startPos);
                    this.isPlayerMove = true;
                }
                else if(this.camStartPos.x<UnityEngine.Screen.width/2&&this.cameraCanMove()){
                    this.playerMoveDir=Vector2.op_Subtraction(this.camCurPos, this.camStartPos);
                    this.isPlayerMove = true;
                } 
                if(this.isPlayerMove){
                    var camRot = Quaternion.Euler(0, UnityEngine.Camera.main.transform.rotation.eulerAngles.y, 0);
                    var moveDir = Vector2.op_Division(this.playerMoveDir, 100);


                    if (moveDir.magnitude > 0) {

                        if(moveDir.magnitude > 1)
                            moveDir.Normalize();

                        //left-right
                        var optMoveDir = new Vector3(moveDir.x, 0, moveDir.y);
                        optMoveDir = Vector3.op_Multiply(optMoveDir, Time.deltaTime * 80 );
                        this.myCharacter.Move(Quaternion.op_Multiply(camRot,optMoveDir));
                    }
                    this.isPlayerMove = false;
                }
            }
        }
    }

    //follow zepeto character
    LateUpdate()
    {
        if(null == this.myCharacter)
        {
            return;
        }
        
        let characterPos = this.myCharacter.transform.position;
        this.cameraParent.transform.position = new Vector3(characterPos.x, characterPos.y + 1, characterPos.z);
        if(this.startPos.x>UnityEngine.Screen.width/2&&this.CanMove()) {
            this.cameraMoveDir=Vector2.op_Subtraction(this.curPos, this.startPos);
            this.isCameraMove = true;
        }
        else if(this.camStartPos.x>UnityEngine.Screen.width/2&&this.cameraCanMove()) {
            this.cameraMoveDir=Vector2.op_Subtraction(this.camCurPos, this.camStartPos);
            this.isCameraMove = true;
        }
        if(this.isCameraMove){
            var moveDir = Vector2.op_Division(this.cameraMoveDir, 100);
            this.cameraAngleX += moveDir.x;
            this.cameraAngleY += moveDir.y;
            this.cameraParent.transform.rotation = UnityEngine.Quaternion.Euler(this.cameraAngleY,this.cameraAngleX,0);
            this.isCameraMove = false;
        }
    }
}