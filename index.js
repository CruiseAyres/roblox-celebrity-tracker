const http=require('http');
const request=require('request');
const PORT=process.env.PORT||5000;

const places=[
	//[2837719,606849621],
	[1630228,2960624866],
];

function serverFromHash(id,hash){
	return new Promise(res=>{
		var a=[];
		var m=0;
		for(var c=0;c<=m;c+=10){
			var url=`https://www.roblox.com/games/getgameinstancesjson?placeId=${id}&startIndex=${c}`;
			request.get({url:url,headers:{Cookie:'.ROBLOSECURITY='+process.env.roblosecurity}},(e,r,b)=>{
				var t=JSON.parse(b);
				m=Math.max(m,t.TotalCollectionSize);
				var srvr=t.Collection.find(v=>{
					return v.CurrentPlayers.find(v=>{
						return v.Thumbnail.Url==hash;
					});
				});
				console.log(c);
				if(srvr)res(srvr.Guid);
				else if(c+10>m)res(null);
			});
		}
	});
}

async function update(){
	places.forEach(v=>{
		request.get('https://www.roblox.com/search/users/presence?userIds='+v[0],(e1,r1,b1)=>{
			if(e1)return;
			if(JSON.parse(b1).PlayerPresences[0].InGame){
				var thumb='http://www.roblox.com/headshot-thumbnail/image?width=48&height=48&Format=Png&userId='+v[0];
				request.get(thumb,async(e2,r2,b2)=>{
					var redir=r2.request.uri.href.replace('http','https');
					console.log(await serverFromHash(v[1],redir));
				});
			}
		});
	});
}

const server=http.createServer((req,res)=>{
	res.statusCode=200;
	res.setHeader('Content-Type','text/plain');
	res.end('The server should be checking.');
});
server.listen(PORT,()=>{
	console.log(`Server running on ${PORT}/`);
});
update();
setInterval(()=>{request.get('https://asimo3089-tracker.herokuapp.com/')},69000);
setInterval(update,69000);
