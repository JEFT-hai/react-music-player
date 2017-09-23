# react-music   
***  
react + react-router + pubsub    

一个用`react`写的一个音乐播放器       

[在线预览](https://JEFT-hai.github.io/react-music-player/)

## pubsub

### 提交事件 
  
    Pubsub.publish('PLAY_PREV');

### 事件详情  

    Pubsub.subscribe('PLAY_PREV' , (msg ) =>{
		this.playNext('prev')
	} )

### 解绑
   
    Pubsub.unsubscribe('PLAY_PREV');

## 上(下)一曲以及循环播放处理

    playNext(type= 'next'){
		let index = this.findMusicIndex(this.state.currentMusicItem);
		let newIndex=null;
		let length=this.state.musiclist.length;
		if(type==='next'){
			newIndex=(index+1)%length; 
			// 这个方法更加简洁明了，以前用的方法一直是三位运算
			// newIndex = ((index + 1) < length) ? (index+1) :0 ;
		}else if(type==='prev'){
			newIndex=(index-1+length)%length;
			// newIndex = ((index - 1) > 0 ) ? (index - 1) : (length -1) ;
		}else if(type==='once'){
			newIndex=index
		}else {
			newIndex= Math.floor(Math.Random()*length);
		}
		this.playMusic(this.state.musiclist[newIndex]);
	}
	--
	
##  常用的封装成函数

    findMusicIndex(musicItem){
		return  this.state.musiclist.indexOf(musicItem);
	}

## jPlayer
   
### 引用

    <script type="text/javascript" src='http://www.jplayer.cn/demos/lib/jquery.min.js'></script>
    <script type="text/javascript" src='http://www.jplayer.cn/demos/dist/jplayer/jquery.jplayer.min.js'></script>

### 用到的API

    $('#player').jPlayer('play');                                  <!-- 播放与暂停 -->
    $('#player').jPlayer('pause') 

    $('#player').bind($.jPlayer.event.timeupdate, (e)=>{           <!-- 监听音乐播放时间 -->
			duration=e.jPlayer.status.duration;                    <!-- 歌曲总时长 -->
			this.setState({
				volume : e.jPlayer.options.volume * 100,           <!-- 音量 -->
				time :e.jPlayer.status.currentTime,                <!-- 歌曲播放当前时间 -->
				progress: e.jPlayer.status.currentPercentAbsolute  <!-- 当前歌曲播放进度百分比 -->
			})
		});
	$('#player').bind($.jPlayer.event.ended,(e)=>{}                <!-- 监听音乐播放完毕 -->

    $('#player').unbind($.jPlayer.event.timeupdate);               <!-- 要在componentWillUnmount中解绑 --> 
	$('#player').unbind($.jPlayer.event.ended)

## react


### react-router

    import {  hashHistory  ,Router, Route, IndexRoute } from 'react-router'
    class Root extends React.Component {
    	render(){
    		return (
    			<Router history={hashHistory}>
    				<Route path='/' component={App}>
    					<IndexRoute component={Player} />
    					<Route path='/list' component={Musiclist}></Route>
    				</Route>
    			</Router>
    		)
    	}
    }

### 将状态克隆给子组件

    { React.cloneElement(this.props.children , this.state) }
    <!-- 页面上App组件的子组件为 Player与 Musiclist  -->

### progress组件

    <Progress progress={this.state.volume} barColor="red" onProgressChange={this.changeVolumeHanler} />
    changeProgress(e){
		let progressBar = this.refs.progressBar;  <!-- 获取进度条DOM -->
		let progress = (e.clientX - progressBar.getBoundingClientRect().left) /progressBar.clientWidth;
		<!-- 获取点击进度条百分比 -->
		this.props.onProgressChange && this.props.onProgressChange(progress);
		<!-- 改变进度条时，执行对应事件 -->
	}

## Player组件Layout

### 用到的是栅格布局，原理是伸缩盒的知识

    .row
    {
        display: -webkit-box!important;
        display: -webkit-flex!important;
        -webkit-align-items: center;
        -webkit-box-align: center;
        width: 100%;
    }
    .row>*
    {
        display: block!important;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
    }
    .row>.-col-auto
    {
        display: block!important;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 auto;
    }

    flex样式解析：
     
    display:-webkit-flex     提供一个伸缩盒的容器
     
    -webkit-align-items:
     
    flex-start：弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴起始边界。
     
    flex-end：弹性盒子元素的侧轴（纵轴）起始位置的边界紧靠住该行的侧轴结束边界。
     
    center：弹性盒子元素在该行的侧轴（纵轴）上居中放置。（如果该行的尺寸小于弹性盒子元素的尺寸，则会向两个方向溢出相同的长度）。  
    -webkit-flex:复合属性。设置或检索弹性盒模型对象的子元素如何分配空间。  

    none：
     
    none关键字的计算值为: 0 0 auto
     
    [ flex-grow ]：定义弹性盒子元素的扩展比率。   （定义空间的分配权）
     
    [ flex-shrink ]：定义弹性盒子元素的收缩比率。　　（若溢出时，按照比例消化多出来的空间）
     
    [ flex-basis ]：定义弹性盒子元素的默认基准值。　　　　（定义元素的宽度值，若没有指定则取决与元素本身宽度值） 
    借鉴此处(http://www.jb51.net/css/533000.html)


    
