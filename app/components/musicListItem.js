import React from 'react'
import  './listitem.less'
import Pubsub from 'pubsub-js'
import {Link} from  'react-router'

class MusicListItem extends React.Component{
	playMusic(musicItem){
		Pubsub.publish('PLAY_MUSIC' , musicItem);
		// Pubsub.publish('IS_PLAY' , true);
	}
	deleteMusic(musicItem , event){
		event.stopPropagation();
		Pubsub.publish('DELETE_MUSIC' , musicItem);
	}
	render(){
		let musicItem = this.props.musicItem;
		return (
			<li onClick={this.playMusic.bind(this,musicItem)} className={`components-listitem row ${this.props.focus ? 'focus':''}`}>
				<Link to='/'><p><strong>{musicItem.title}</strong> - {musicItem.artist}</p></Link>
				<p onClick={this.deleteMusic.bind(this,musicItem)} className='-col-auto delete'></p>
			</li>
		)
	}
}

export default MusicListItem;