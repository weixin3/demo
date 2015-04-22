function route(pathname,handle,response,request){
	console.log("about to route request for "+pathname);
	if(typeof handle[pathname]==='function'){
		handle[pathname](response,request);
	}else{
		console.log("没有该请求的跳转");
		response.writeHead(404,{"Content-Type":"text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

exports.route = route;