//초기 화면


var IsGameRun=false
var Score=10;
var GameTitleText=newGameObject("titleText")
GameTitleText.graphic=newGraphic("txt",-1,"  벽돌 부슈기",-1,-1,"#000000","100px 함초롱바탕")
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
GameStartButton.update=function(){
	if(InputMgr.KeyPush[13])
		GameStartButton.ClickThis()
}
GameStartButton.ClickThis=function()
{
	
	DeleteGameObject(btnText)
	DeleteGameObject(GameTitleText)
	DeleteGameObject(this)
	IsGameRun=true
	//
	registerGameObject(ball)
	registerGameObject(bar)
	
	for(var x=0;x<1024;x+=50){//21
		for(var y=50;y<=300;y+=50){//6

			var temp=newGameObject("brick")
			temp.x=x;
			temp.y=y;
			temp.graphic=newGraphic("rect",0,49,49,"#00eeff");
			temp.update=function()
			{
				if(Math.abs(this.x-ball.x)<=30&&Math.abs(this.y-ball.y)<=30){
					DeleteGameObject(this)
					if(Math.abs(30-Math.abs(this.y-ball.y))<Math.abs(30-Math.abs(this.x-ball.x)))ball.dy*=-1;
					else ball.dx*=-1;
					Score+=10;
					
				}
				
			}
			
			registerGameObject(temp)
		}
	}

	var ScoreUI=newGameObject("sc")
	ScoreUI.graphic=newGraphic("txt",10,"",-1,-1,"#FFFFFF","#100px 함초롱바탕")
	ScoreUI.x=350
	ScoreUI.y=500
	ScoreUI.update=function(){
		if(IsGameRun)Score-=Time.deltaTime
		
		ScoreUI.graphic=newGraphic("txt",10,Math.round(Score).toString(),-1,-1,"#FFFFFF","300px 함초롱바탕")
		if(Score<=0)GameOver()
	}
	registerGameObject(ScoreUI)
}

registerGameObject(GameTitleText)
registerGameObject(GameStartButton)
registerGameObject(btnText)
StartGame(60,"벽돌 부슈기")

var ball=newGameObject("ball")
ball.graphic=newGraphic("cir",0,10,"#00eeff")
ball.x=512
ball.y=360
ball.dx=0;
ball.dy=600;
ball.update=function(){
	
	this.x+=this.dx*Time.deltaTime;
	this.y+=this.dy*Time.deltaTime;
	if(this.x<=10)this.dx=Math.abs(this.dx)
	if(this.x>=canvas.width-10)this.dx=-Math.abs(this.dx)
	if(this.y<=10)this.dy=Math.abs(this.dy)
	if(this.y>=canvas.height-10){GameOver()}
	if(bar.y-this.y<=10&&Math.abs(bar.x-this.x)<=80){
		
	
		var temp=Math.abs((this.x-bar.x)*15);
		if(this.dx>0)this.dx=temp;
		else this.dx=-temp;
		this.dy=-Math.abs(this.dy)
		var rate=600/Math.sqrt((this.dx*this.dx)+(this.dy*this.dy))
		this.dx*=rate;
		this.dy*=rate;
		Score-=1;
		
	}		
	
	
}
var bar=newGameObject("bar")
bar.graphic=newGraphic("rect",0,10,150,"#00eeff")
bar.x=512
bar.y=700
bar.update=function()
{
	if(InputMgr.KeyPush[39])this.x+=600*Time.deltaTime;
	if(InputMgr.KeyPush[37])this.x-=600*Time.deltaTime;
	if(this.x<50)this.x=50
	if(this.x>canvas.width-50)this.x=canvas.width-50;
	
}
function GameOver(){
	
	var Go=newGameObject("go")
	Go.graphic=newGraphic("txt",-2,"새로고침(F5)를 눌러 다시 도전해보세요",-1,-1,"#FFFFFF","30px 함초롱바탕")
	Go.x=200;
	Go.y=200;
	Go.temp=0;
	Go.update=function(){
		this.temp++
		if(this.temp>2)
		{
		alert("게임오버")
		setRank(Score,"")
			StopGame()
		};
	}
	registerGameObject(Go)
		
}


