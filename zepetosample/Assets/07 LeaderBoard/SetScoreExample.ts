
import { GameObject, Rect, Sprite, Texture, Texture2D, Vector2, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { GetRankResponse, LeaderboardAPI, Rank, ResetRule, SetScoreResponse } from 'ZEPETO.Script.Leaderboard';
import ClientStarter from '../Multiplay/ClientStarter';
import { Image, Text } from 'UnityEngine.UI'
import { Result } from 'UnityEngine.Networking.UnityWebRequest';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoWorldHelper, Users } from 'ZEPETO.World';
import { Player } from 'ZEPETO.Multiplay.Schema';
import ClientSaveLoad from '../Multiplay/ClientSaveLoad';

var picList: GameObject[];
var textList: GameObject[];
var score: number;
var text: Text;
var name: string;
var clearPreviousScore = true;
var MinTime: number = 0;
var ScoreTime: number = 1;
var image: Image;
var myRecord: Text;
var sortedRank:Rank[];
var spriteMap: Map<string, Sprite> = new Map<string, Sprite>();

var nameUserIdMap:Map<string,string> = new Map<string,string>();
var ids: string[] = new Array<string>();
var cs;
var csSave;


var sessionIdList:Array<string> = Array<string>();
export default class SetScoreExample extends ZepetoScriptBehaviour {

    public leaderboardId: string[];
    public startRank: number;
    public endRank: number;
    public resetRule: ResetRule;
    public pictureList: GameObject[];
    public static instance: SetScoreExample;


    public cs:GameObject;
    public csSave:GameObject;

    public textList: GameObject[];
    public myRecord: GameObject;
    public myImage: GameObject;
    private cnt: number = 0;
    private cnt2: number = 0;


    spriteList: Sprite[] = null;
    public static getInstance() {
        if (this.instance == null) {
            this.instance = new SetScoreExample();
        }

        return this.instance;
    }

    Start() {
        textList = this.textList;
        picList = this.pictureList;
        myRecord = this.myRecord.GetComponent<Text>();
        cs = this.cs.GetComponent<ClientStarter>();
        csSave = this.csSave.GetComponent<ClientSaveLoad>();
        this.StartCoroutine(this.UpdateData(5));




    }
    GetSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));

    }
    OnResult(result: GetRankResponse) {

    }

    OnResultForSettingScore(result: SetScoreResponse) {

    }

    OnSetError(error: string) {
        console.error(error);

        //ClientStarter.getInstance().updateScore(score);
    }


    OnGetError(error: string) {
        console.error(error);

        //ClientStarter.getInstance().updateScore(score);
    }


    public getScore(): number {
        return score;
    }



    public updateRankingBoard() {


    }

    initProfile(): boolean {
        if (cs.getJoinPlayer().length <= 0) {
            console.error("the num of Joined player is 0");
            return false;
        }
        sessionIdList = csSave.getUserIdList();

        console.log("session id list length : " + sessionIdList.length );
        /*
        cs.getJoinPlayer().forEach((join) => {
            console.log("player name " + join.getPlayer().zepetoUserId);
            ids.push(join.getPlayer().zepetoUserId);
            //joinMap.set(join.getPlayer().zepetoUserId)


        });
*/
        ZepetoWorldHelper.GetUserInfo(sessionIdList, (info: Users[]) => {
            for (let i = 0; i < sessionIdList.length; i++) {
                ZepetoWorldHelper.GetProfileTexture(sessionIdList[i], (texture: Texture) => {
                    spriteMap.set(sessionIdList[i], this.GetSprite(texture));
                }, (error) => {
                    console.log(error);
                    
                });
            }
        }, (error) => {
            console.log(error);
        });


        return true;
    }


    
    setRankScore(result:GetRankResponse) {
        //for each text,
        for (let i = 0; i < textList.length; i++) {
            score = 100 * Math.random();
            if (result.rankInfo.rankList[this.cnt] != null) {
                //update score
                var rank = result.rankInfo.rankList[this.cnt];
                rank.score = score;
                nameUserIdMap.set(rank.name,sessionIdList[this.cnt]);
                LeaderboardAPI.SetScore(this.leaderboardId[MinTime], score, sessionIdList[this.cnt], this.OnResultForSettingScore, this.OnSetError);
                this.cnt++;
            }
            //no more item : empty text.
            else {
                this.cnt = 0;
            }
        }
        //resort data
        sortedRank = result.rankInfo.rankList.sort((a, b) => {
            if (a.score > b.score) return 1;
            else if (a.score < b.score) return -1;
            return 0;
        });
    }


    getRankScore()
    {
        for (let i = 0; i < sortedRank.length; i++) {
            var line = textList[i];
            var pic = picList[i];

            image = pic.GetComponent<Image>();
            text = line.GetComponent<Text>();
            var rank2 = sortedRank[i];
            text.text = rank2.name + " / " + rank2.score.toString();


            for(let s=0; s<sortedRank.length; s++)
            {
                
                console.log("Sprite instance id" + spriteMap.get(sessionIdList[s]).GetInstanceID);
                if(sortedRank[i].member == sessionIdList[s])
                {
                    
                    image.sprite = spriteMap.get(sessionIdList[s]);
                }
                myRecord.text = "My Score : " + sortedRank[s].score;
                
            }

            /*
            sortedRank.forEach((rank) => {

                myRecord.text = "My Score : " + rank.score;

                console.log("userid " + sessionIdList[] );
              
                image.sprite = spriteMap.get(nameUserIdMap.get(rank.name)) as Sprite;
                
            });*/
        }
    }

    setRankingData() {
        //init score data
        score = 100 * Math.random();
        LeaderboardAPI.SetScore(this.leaderboardId[MinTime], 0,sessionIdList[0], this.OnResultForSettingScore, this.OnSetError);

        //must use lambda.
        LeaderboardAPI.GetRangeRank(this.leaderboardId[MinTime], this.startRank, this.endRank, this.resetRule, true, (result: GetRankResponse) => {
            
            this.setRankScore(result);

            this.getRankScore();

            this.myImage.GetComponent<Image>().sprite = spriteMap.get(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.userId);




        }, this.OnGetError);
    }
    *UpdateData(tick: number) {

        while (true) {

            yield new WaitForSeconds(tick);

            this.initProfile();
            if (!this.initProfile()) {
                console.error("Failed to generate the profile");
                return;
            }

            else {
                this.setRankingData();

            }

        }
    }
}

class JoinPlayer {
    sessionId: string;
    player: Player;


    JoinPlayer(id: string, p: Player) {
        this.sessionId = id;
        this.player = p;
        
    }


    public getID(): string {
        return this.sessionId;
    }

    public getPlayer(): Player {
        return this.player;
    }


}




