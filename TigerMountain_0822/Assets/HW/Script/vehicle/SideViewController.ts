import {ZepetoScriptBehaviour} from 'ZEPETO.Script'
import {PlayerInput,InputAction} from "UnityEngine.InputSystem"
import {CallbackContext} from "UnityEngine.InputSystem.InputAction"
import {CharacterState, ZepetoCharacter, ZepetoPlayers, ZepetoCamera} from 'ZEPETO.Character.Controller'
import {Quaternion, Time, Vector2, Vector3} from "UnityEngine";
import * as UnityEngine from "UnityEngine";
import * as UnityEngineUI from "UnityEngine.UI";

export default class SideViewController extends ZepetoScriptBehaviour {

    @Header("Camera Object")
    public cameraParent : UnityEngine.GameObject;
    public customCamera : UnityEngine.Camera;

    @Header("Player to Camera Distance")
    public cameraDistance : number = 10;

    @Header("Camera maximum rotate Angle")
    public maximumXAngle : float = 180;
    public maximumYAngle : float = 90;

    @Header("Camera rotation speed scale value")
    public cameraXSpeed : float = 0.7;
    public cameraYSpeed : float = 0.7;

    private myCharacter: ZepetoCharacter;
    
    private startPos: UnityEngine.Vector2 = UnityEngine.Vector2.zero;
    private curPos: UnityEngine.Vector2 = UnityEngine.Vector2.zero;

    private playerInput: PlayerInput;
    private touchPositionAction : InputAction;
    private touchTriggerAction : InputAction;

    private isTriggered: boolean = false;
    private isTouchDown: boolean = false;

    private camTouch : InputAction;
    private camTouchTrigger : InputAction;

    private isCamTriggered : boolean = false;
    private isCamTouchDown : boolean = false;

    private camStartPos: UnityEngine.Vector2 = UnityEngine.Vector2.zero;
    private camCurPos: UnityEngine.Vector2 = UnityEngine.Vector2.zero;

    private cameraAngleX : float = 0;
    private cameraAngleY : float = 0;

    private playerMoveDir : UnityEngine.Vector2 = UnityEngine.Vector2.zero;
    private cameraMoveDir : UnityEngine.Vector2 = UnityEngine.Vector2.zero;
    
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
        //this.gamemanager = GameManager.GetInstance();
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
                this.curPos = context.ReadValueAsObject() as UnityEngine.Vector2;
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
            var cCurPos = context.ReadValueAsObject() as UnityEngine.Vector2;
            if(this.isCamTouchDown)
            {
                this.camCurPos = context.ReadValueAsObject() as UnityEngine.Vector2;
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
            this.cameraParent.transform.position = new UnityEngine.Vector3(characterPos.x, characterPos.y + 1, characterPos.z);
            this.customCamera.transform.position = new UnityEngine.Vector3(characterPos.x, characterPos.y + 1, characterPos.z-this.cameraDistance);
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
                    this.playerMoveDir=UnityEngine.Vector2.op_Subtraction(this.curPos, this.startPos);
                    this.isPlayerMove = true;
                }
                else if(this.camStartPos.x<UnityEngine.Screen.width/2&&this.cameraCanMove()){
                    this.playerMoveDir=UnityEngine.Vector2.op_Subtraction(this.camCurPos, this.camStartPos);
                    this.isPlayerMove = true;
                } 
                if(this.isPlayerMove){
                    
                    var camRot = this.cameraParent.transform.rotation;
                    var moveDir = UnityEngine.Vector2.op_Division(this.playerMoveDir, 100);


                    if (moveDir.magnitude > 0) {

                        if(moveDir.magnitude > 1)
                            moveDir.Normalize();

                        //left-right
                        var optMoveDir = new UnityEngine.Vector3(moveDir.x, 0, moveDir.y);
                        optMoveDir = UnityEngine.Vector3.op_Multiply(optMoveDir, UnityEngine.Time.deltaTime * 80 );
                        if(this.myCharacter.transform.parent){
                            var rot =UnityEngine.Quaternion.Euler(0,camRot.eulerAngles.y,0);
                            var moveVector = this.myCharacter.transform.parent.transform.position+(camRot * optMoveDir);
                            moveVector.y = this.myCharacter.transform.parent.transform.position.y;
                            this.myCharacter.transform.parent.transform.LookAt(moveVector);
                            moveVector = this.myCharacter.transform.parent.transform.position+(camRot * optMoveDir) * 0.1;
                            moveVector.y = this.myCharacter.transform.parent.transform.position.y;
                            this.myCharacter.transform.parent.transform.position = moveVector;
                            
                        }
                        else{
                            this.myCharacter.MoveToPosition(this.myCharacter.transform.position+(camRot * optMoveDir));
                        }
                        
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
        this.cameraParent.transform.position = new UnityEngine.Vector3(characterPos.x, characterPos.y + 1, characterPos.z);
        if(this.startPos.x>UnityEngine.Screen.width/2&&this.CanMove()) {
            this.cameraMoveDir=UnityEngine.Vector2.op_Subtraction(this.curPos, this.startPos);
            this.isCameraMove = true;
        }
        else if(this.camStartPos.x>UnityEngine.Screen.width/2&&this.cameraCanMove()) {
            this.cameraMoveDir=UnityEngine.Vector2.op_Subtraction(this.camCurPos, this.camStartPos);
            this.isCameraMove = true;
        }
        if(this.isCameraMove){
            var moveDir = this.cameraMoveDir.normalized;
            this.cameraAngleX += moveDir.x*this.cameraXSpeed;
            this.cameraAngleY += moveDir.y*this.cameraYSpeed;
            if(this.maximumXAngle<180){
                this.cameraAngleX = UnityEngine.Mathf.Clamp(this.cameraAngleX,-this.maximumXAngle,this.maximumXAngle);
            }
            this.cameraAngleY = UnityEngine.Mathf.Clamp(this.cameraAngleY,90-this.maximumYAngle,this.maximumYAngle);
            this.cameraParent.transform.rotation = UnityEngine.Quaternion.Euler(this.cameraAngleY,this.cameraAngleX,0);
            this.isCameraMove = false;
        }
        
    }

}