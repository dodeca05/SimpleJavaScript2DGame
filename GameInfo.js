function MakeGameInfo(GameName,Tag,ThumnailSrc,DetailExp,Link)
{
	var result={};
	result.Tag=Tag;
	result.GameName=GameName;
	result.ThumnailSrc=ThumnailSrc;
	result.DetailExp=DetailExp;
	result.Link=Link;
	
	return result;
	
}
var GameLst=new Array()
GameLst[GameLst.length]=MakeGameInfo("블랙잭","보드게임 마우스조작","./src/backjack_thumbnail.png","카드게임","./Game/blackjack/Game.html")
GameLst[GameLst.length]=MakeGameInfo("마우스 피하기","클래식게임 마우스조작","./src/mouse_thumbnail.png","마우스로 장애물을 피해라","./Game/mousemover/Game.html")
GameLst[GameLst.length]=MakeGameInfo("벽돌 부슈기","클래식게임 키보드조작","./src/brick_thumbnail.png","벽돌을 부슈고 고득점을 얻어라","./Game/brokenbrick/Game.html")
