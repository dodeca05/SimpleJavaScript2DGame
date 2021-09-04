  //초기 화면
var IsGameRun=false
var Score=0;
var GameTitleText=newGameObject("titleText")
GameTitleText.graphic=newGraphic("txt",-1,"마우스 피하기",-1,-1,"#000000","100px 함초롱바탕")
GameTitleText.x=230
GameTitleText.y=200
var GameStartButton=newGameObject("startbtn")
GameStartButton.graphic=newGraphic("rect",10,100,300,"#00AAAA")
var btnText=newGameObject("btnText")
btnText.graphic=newGraphic("txt",-1,"GameStart",-1,-1,"#FFFFFF","40px 함초롱바탕")
btnText.x=420
btnText.y=600
GameStartButton.x=512
GameStartButton.y=600
GameStartButton.ClickThis=function()
{
	
	DeleteGameObject(btnText)
	DeleteGameObject(GameTitleText)
	DeleteGameObject(this)
	IsGameRun=true
	registerGameObject(makeBlock(512,5,40,1024))
	registerGameObject(makeBlock(521,715,40,1024))
	registerGameObject(makeBlock(5,360,720,40))
	registerGameObject(makeBlock(1019,360,720,40))
	///////
	var ScoreUI=newGameObject("UI")
	ScoreUI.y=50
	ScoreUI.graphic=newGraphic("txt",-1,"점수 :",-1,-1,"#FFFFFF","50px 함초롱바탕");
	ScoreUI.update=function(){
		this.graphic.text="점수 : "+Score.toFixed(2).toString();
		
	}
	registerGameObject(ScoreUI)
	var GameMgr=newGameObject("mgr")
	GameMgr.temp=0;
	GameMgr.temp2=0;
	GameMgr.update=function(){
		if(IsGameRun)
		Score+=Time.deltaTime;
		this.temp+=Time.deltaTime;
		if(this.temp>0.12){
			this.temp=0;
			this.temp2++;
		
			var bx=Math.floor(Math.random()*1000)+20
			var spd=Math.floor(Math.random()*80)+40
			var block=makeBlock(bx,0,70,70)
			block.spd=spd;
			block.update=function(){
				this.y+=spd*Time.deltaTime
				if(this.y>800){
					DeleteGameObject(this)
				}
			}
			if(this.temp2==25){
				this.temp2=0;
				block.graphic.color="#00ee00";
				block.MouseOnEnter=function(){
					if(IsGameRun){
					DeleteGameObject(this)
					Score+=10;
					}
					}
			}
			
			registerGameObject(block)
		}
	}
	registerGameObject(GameMgr)
	
}

registerGameObject(GameTitleText)
registerGameObject(GameStartButton)
registerGameObject(btnText)
StartGame(60,"마우스 피하기")


/////////////////////////////////게임시작
var i=0;
var GameEndF=function(){
		if(IsGameRun){
		
		alert("마우스가 닿음")
		}
		GameOver();
		
	}
function makeBlock(x,y,h,w){
	var result=newGameObject("block"+i.toString());
	result.x=x;
	result.y=y;
	result.graphic=newGraphic("rect",0,h,w,"#AA0000")
	result.MouseOnEnter=GameEndF
	i++;
	return result;
}
function GameOver()
{
	DeleteGameObject(FindObjectByName("UI"));
	IsGameRun=false;
	var GameOverText=newGameObject("UI");
	GameOverText.graphic=newGraphic("txt",-1,"최종 점수:"+Score.toFixed(2).toString(),-1,-1,"#000000","80dp 함초롱바탕");
	GameOverText.y=400;
	GameOverText.x=100;
	setRank(Score,"");
	registerGameObject(GameOverText)
	var RetryBtn=newGameObject("btn")
	RetryBtn.graphic=newGraphic("img",-1,"./src/rtbtrn.png",100,300)
	RetryBtn.x=512
	RetryBtn.y=500
	RetryBtn.ClickThis=function(){
		location.reload();
	}
	registerGameObject(RetryBtn)
}