# 学习文档
@(作者:)[魏鑫]

###一.关于nodejs的学习心得
####什么是nodejs
nodejs是一个服务器程序，用于在服务端运行JavaScript代码。JavaScript代码最早的时候是运行在浏览器中，是用于客户端来执行的代码，来减少服务器的压力。而NodeJs,它可以允许javascript代码脱离浏览器，在服务器后端来解释和执行javascript代码。NodeJs事实上既是一个运行时环境（类似JDK这种），同时又是一个库。
####nodejs的好处
nodejs适合处理高流量高并发，但是在响应客户端之前，服务端的处理逻辑不是那么的复杂。
####nodejs模块
nodejs提供了很多原生的和非原生的模块（类似于java中的jar包），方便用户做各种处理。比如原生模块中提供的http,用于启动服务并且监听端口。在使用http之前，先要注入该模块。

```javascript
var http = require("http");//注入http模块
function onRequest(request,response){
	response.writeHead(200,{"Content-Type":"text/plain"});
	response.write("Hello World");
	response.end();
}

//http中的listen监听端口。http中的createServer来处理结果	
http.createServer(onRequest).listen(8888);
console.log("Server has started.");
```

原生模块url用于获取请求路径
```javascript
var url = require("url");//注入url模块
var pathname=url.parse(request.url).pathname;//调用url的parse方法来获取传入的url值。
```

原生模块querystring用于解析请求中的参数。
```javascript
var querystring = require("querystring");//注入querystring
var postData ="";
//注册了“data”事件的监听器，用于收集每次接收到的新数据块，并将其赋值给postData 变量
request.addListener("data",function(postDataChunk){
	postData += postDataChunk;      
    });
    
//注册了“end”事件,用于处理“data”加载完后的事件处理。
request.addListener("end",function(){
	   var textVal= querystring.parse(postData ).text;//通过querystring的parse方法来封装表单中传过来的数据，并获取属性。   
    });
```


下面的代码可以更加直观的理解如何解析浏览器URL地址传过来的请求
```javascript
                               url.parse(string).query
                                           |
           url.parse(string).pathname      |
                       |                   |
                       |                   |
                     ------ -------------------
http://localhost:8888/start?foo=bar&hello=world
                                ---       -----
                                 |          |
                                 |          |
              querystring(string)["foo"]    |
                                            |
                         querystring(string)["hello"]
```

nodejs除了原生模块之外，还有一些非原生模块。非原生模块包括两种，一种是我们自己创建的模块，一个JS文件，可以当成是一个 模块。比如我创建一个server.js文件，里面的代码是
```javascript
var http = require("http");
var url = require("url");

function start(){
	function onRequest(request,response){
		var pathname=url.parse(request.url).pathname;
		console.log("Request for "+pathname +" received.");
	}
	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}

exports.start=start;//将start方法开放出来，让模块在应用该模块的时候，可以使用start方法
```

其他模块要使用该模块的时候，就需要在代码中引入该模块。和引入原生模块一样，只是需要给该模块一个目录所在的路径而已
```javascript
var server = require("./server");//引入server.js模块。我这里是在同一目录下。我们不需要加.js的文件后缀名，nodejs会自动帮我们加上。
server.start();//调用server.js模块中开放的start方法。（注意：该方法必须在模块中开放，我们才能引入使用）
```

还有一种非原生模块是其他人提供的。可以理解为其他人提供的插件或者外部引入的jar包吧。在使用其他人提供的模块之前，先要下载该模块。比如我用到的外部模块是Felix Geisendörfer开发的node-formidable模块。这个模块提供了很好的文件上传功能。在使用它之前，我们需要使用nodejs的包管理器，叫NPM的东西，来下载安装该模块。很简单，使用代码

```javascript
npm install formidable
```
安装成功后，我们就可以用formidable模块了——使用外部模块与内部模块类似，用require语句将其引入即可
```javascript
var formidable = require("formidable");
```
具体formidable模块怎么使用，请自己百度。这里我提供一个简单的网上[案例](http://blog.csdn.net/lfsfxy9/article/details/8870069)。

####nodejs学习参考资料
[Node初学者入门](http://ourjs.com/detail/529ca5950cb6498814000005)




###二.关于GIT以及GITHUB的学习心得
####什么是GIT
GIT是一种版本控制系统，用于管理项目代码的版本问题。和我之前使用的VSS等版本控制系统相比较，GIT更加的完美，方便，高效率等等，可以简单的说，它的设计上，更加的高科技。
####GIT的优点
GIT的优点很多，下面我介绍一下我所理解的优点。
#####1.分布式
GIT和VSS以及一些老的SVN版本控制器最大的区别在，他是分布式管理的。传统的CVS，SVN等都是集中式管理，版本库集中在存放在中央服务器。这样会非常的依赖于中央服务器。我在以前的工作中，也遇到过，中央服务器由于某种原因，挂了，一下子起不来。但是我的新功能本周就需要上线。却获取不到版本库上的最新代码，非常的麻烦。或者是我不在办公室，我正在出差，但是中央服务器只有内部网络才能访问到，这样我也没办法去获取最新的版本库代码来完成我接下来安排的事情。
但是GIT采用的分布式版本控制就不一样了。每个人的电脑都是一个版本库，这样，你在就算不在联网的情况下，也可以安心工作，因为版本库就在你的电脑上。等改完代码后，只需要将你本机的版本库推送给其他同事的电脑，就可以完成多人协作了。在实际使用中，分布式版本控制系统也会有一台充当中央服务器的电脑。大家把完成的代码都推送给中央服务器，而其他人可以去中央服务器得到最新的代码。这样做更加的安全，如果某一天，这台中央服务器电脑挂了，也没关系，我们可以直接通过连接同事的版本库，就可以实现推送和下载代码。

#####2.版本回退效率非常高，并且不怕文件丢失
GIT的版本回退效率很高，有点像时光机一样。你可以迅速到达任何一个以前的版本。为什么他的效率如此的高效，这就需要了解GIT的设计了。GIT的设计中，有工作区和暂存区两个区域。工作区就是你设置的版本库所在目录了。版本库就在该目录下一个隐藏的.git文件。版本库中有很多东西，比如称为stage的暂存区，和我们创建的分支。（注：创建版本库的时候，GIT会自动为我们创建一个主分支master和指向master的一个指针HEAD）。在GIT中，我们在提交文档的时候，需要两个动作，第一个通过git  add <文件名称> 把需要提交的文件，全部放在暂存区。第二，是把暂存区的文件，通过git  commit提交到当前的分支。在提交的过程中，GIT会把此次提交的动作，附上一个唯一标示的commit id。通过这个ID，你可以回到任何一个以前的版本。因为GIT是记录版本提交的动作，因此他的回退会非常的快。还有一个好处就是，不用担心文件的丢失。就算你把当前版本的文件给误删了，也可以回退到老版本中把他找回来。因为老版本的文件一直在版本库中。

#####3.远程仓库
就是把一台电脑充当服务器，其他人从这个服务器中可以把版本库克隆到自己电脑。并且可以把本地版本库的修改，都推送到服务器，也可以从服务器拉取别人的提交，这样就可以保证本地版本和远程版本的同步了。当然我们在学习的时候，不可能找个电脑来充当远程服务器，GIT为我们提供了一个非常好的东西，那个就是[GitHuh](https://github.com/)网站。你只需要在上面注册账号，一台由GIT提供的免费远程库就出现了。这样 就可以把本地的版本库，推送到远程库。其他人也可以从远程库获取到你最近推送的代码。在推送本地代码到远程仓库之前，先要把本机的SSK KEY配置到远程仓库。让远程仓库知道你这个电脑上的推送信息是合法的，而不是随便什么人都可以往你的远程库推送东西。而获取其他人的远程库代码，就不需要关联SSH KEY了。

#####4.分支管理
GIT 的分支功能与其他相比，效率更高。分支之间的切换速度非常的快。大大的提高了开发效率。GIT 在创建版本库的时候，会创建一个主分支master。每个分支会记录你的所有COMMIT操作。一般主分支用于记录整个项目的版本记录。分支的好处在于，你可以把你的工作在你自己的分支上修改，而不影响到大家都在用的主分支。等你把你的工作完成后，再把你在分支上的修改的内容，和主分支合并起来。如果两个人的分支都对同一个文件做了修改，再合并分支的时候，GIT也会给出提示，用于解决分支合并的冲突问题。总的来说，分支的特点，就是你可以在自己的分支上，做自己想做的事情，而不影响主分支的使用。你也可以把做了一半的分支保存起来，继而回到主分支中，做一些紧急的任务，等做完之后，再回到做了一半的分支上，恢复场景，继续修改。这样你的工作思路就不会被打乱。


####GIT常用指令
#####初始化配置
```
//配置使用git仓库的人员姓名  
git config --global user.name "Your Name Comes Here" 

//配置使用git仓库的人员email  
git config --global user.email you@yourdomain.example.com  

//创建仓库，将当前目录变成GIT可以管理的仓库。创建成功后，该目录下，会有一个.git的隐藏文件（就是git的版本库）。
git init
```


#####添加提交
```
git add <file>      // 将工作文件修改提交到本地暂存区  
git add .           // 将所有修改过的工作文件提交暂存区

git commit –m “xxx”  //将暂存区的文件提交到版本库。“xxx”是该次提交的说明。如：git commit –m “增加了一个验证功能”
```

#####版本回退
```
git log			                  //查看历史版本提交的详细信息
git log --pretty=oneline          //查看历史版本提交的简要信息
git log <file>                    //查看该文件每次提交记录  
git log -p <file>                 //查看每次详细修改内容的diff  
git log -p -2                     //查看最近两次详细修改内容的diff  
git log --stat                    //查看提交统计信息 

//可以通过两种方式回退代码。1，通过HEAD，HEAD表示当前的提交的版本。HEAD^表示上一个版本，HEAD^^表示上上版本，HEAD~100表示往上100个版本。2，通过COMMIT时保存的commit id来回退。
git reset --hard HEAD^			   //回退到上个版本				
git reset –hard <commit id>        //如 git reset --hard 3628164,回退到commit id是3628164的版本
git reflog                         //记录每一次的操作，以免你在回退之后，有反悔要回到未来
git status                         //查看当前工作区和版本库的状态
git checkout -- readme.txt         //把readme.txt文件在工作区的修改全部撤销
git reset HEAD readme.txt          //把暂存区的修改撤销掉，重新放回工作区

//删除文件
rm  readme.txt                     //删除工作区文件
git rm readme.txt                  //删除版本库中的文件
删除后再提交  git commit –m “xxx”
git checkout -- readme.txt         //本地文件误删，可以通过这个方法把该文件再找回来
```


#####比较差异
```
git diff <file>                  //比较当前文件和暂存区文件差异  
git diff  
git diff <$id1> <$id2>           //比较两次提交之间的差异  
git diff <branch1>..<branch2>    // 在两个分支之间比较  
git diff --staged                //比较暂存区和版本库差异  
git diff --cached                //比较暂存区和版本库差异  
git diff --stat                  //仅仅比较统计信息  
```


#####远程仓库
```
//Clone远程版本库  
git clone git@xbc.me:wordpress.git  
  
//添加远程版本库origin，语法为 git remote add [shortname] [url]  
git remote add origin git@xbc.me:wordpress.git  

git remote              //查看远程库名称
git remote –v           //查看远程库名称，信息更详细

git push -u origin master        //将本地主分支推到远程(如无远程主分支则创建，用于初始化远程仓库)
git push origin master           //将本地主分支master推到远程origin主分支
git checkout -b dev origin/dev   //在本地创建远程库分支dev和远程库创建分支dev
git branch --set-upstream dev origin/dev    //指定本地分支dev和远程库分支dev做关联。
git pull   //把远程库的分支和本地分支合并
```


#####分支
```
git branck <分支名>         //创建分支
git checkout –b <分支名>    //创建分支,并切换到该分支  如 git checkout –b newfenzhi
git branch                 //查看有哪些分支，以及当前在那个分支上。
git checkout <分支名>       //切换到某个分支  如 git checkout master
git merge <分支名>  	       //合并指定的分支到当前分支
git branch –d <分支名>      //删除分支
git merge --no-ff -m "<分支合并日志>" <分支名>   //合并指定的分支到当前分支，并且禁用fast forward
git stash              //用于保存当前的分支的工作场景。
git stash list         //查看有哪些现场
git stash apply        //恢复现场，但是现场内容不删除。
git stash drop	       //删除现场内容
git stash pop          //恢复现场，同时删除现场内容。
git branch -D <分支名>  //强行删除没有合并过的分支
```


#####标签
```
git tag <标签名>                    //新建标签 如 git tag v1.0
git tag <标签名> <commit id>        //给历史的commit打标签
git tag                            //查看标签
git show <标签名>	                 //查看标签信息
git tag -d <标签名>                 //删除标签
```


####git学习参考资料
[史上最浅显易懂的Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)