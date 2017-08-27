import React, { Component } from 'react';
import './App.css';
import Reader from './Reader';
import Settings from './Settings';
import { Switch, Route, Link } from 'react-router-dom';

const { createElement } = React;

class App extends Component {
	constructor(props) {
		super(props);

		const {
			baseInterval = 150,
			word = 0,
			bookmarks = []
		} = this.load();

		this.state = {
			baseInterval,
			delay: 200,
			reading: false,
			buttonText: 'Begin',
			prevWord: 'the',
			current: 'start',
			nextWord: ':)',
			info: '',
			text: '',
			words: [],
			word,
			bookmarks
		};

		this.lastUpdate = 0;

		this.save = this.save.bind(this);
		this.load = this.load.bind(this);
		this.checkCompat = this.checkCompat.bind(this);
		this.handleFileSelect = this.handleFileSelect.bind(this);
		this.displayContents = this.displayContents.bind(this);
		this.toggle = this.toggle.bind(this);
		this.bookmark = this.bookmark.bind(this);
		this.loadBookmark = this.loadBookmark.bind(this);
		this.renderText = this.renderText.bind(this);
		this.update = this.update.bind(this);
	}

	componentDidMount() {
		if (this.checkCompat()) {
			this.reader = new FileReader();
			this.reader.onload = this.displayContents;
		}
	}

	save() {
		const saveState = {
			baseInterval: this.state.baseInterval,
			word: this.state.word,
			bookmarks: this.state.bookmarks
		};

		localStorage.setItem('speed-reader', JSON.stringify(saveState));
	}

	load() {
		const saveState = JSON.parse(localStorage.getItem('speed-reader')) || {};
		const bookmarks = saveState.bookmarks || [];
		const word = saveState.word || 0;
		const baseInterval = saveState.baseInterval || 150;
		return { baseInterval, word, bookmarks };
	}

	checkCompat() {
		if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
		  alert('The File APIs are not fully supported in this browser.');
			return false;
		}
		return true;
	}

	handleFileSelect(evt) {
		const file = evt.target.files[0];

	  const info = `${escape(file.name)} (${file.type || 'n/a'}) -
	                ${file.size} bytes, last modified:
	                ${file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a'}`;
		this.setState({ info });

		this.reader.readAsText(file);
	}

	displayContents() {
		const text = this.reader.result;
		const words = text.split(/\s+/);
		console.log('got text, length is', text.length);
		this.setState({ text, words, word: 0 });
	}

	toggle() {
		this.save();
		this.setState(prev => {
			// begin reading
			if (!prev.reading) {
				window.requestAnimationFrame(this.update);
			}
			return {
				buttonText: prev.buttonText === 'Begin' ? 'Stop' : 'Begin',
				reading: !prev.reading
			};
		});
	}

	bookmark(e) {
		this.setState(prev => {
			const { word } = prev;
			const context = prev.words.slice(word - 4, word + 4).join(' ');
			const bookmarks = prev.bookmarks.slice();
			bookmarks.push({
				word,
				context
			});
			console.log('bookmark added', bookmarks)
			this.save();
			return {
				bookmarks
			}
		});
	}

	loadBookmark(word) {
		console.log('loading word at', word, typeof word)
		this.setState(prev => {
			return {
				prevWord: prev.words[word - 1],
				current: prev.words[word],
				nextWord: prev.words[word + 1],
				word
			}
		})
	}

	renderText() {
		//const following = this.state.words.slice(this.state.word + 2).join(' ');
		const regex = new RegExp(`^\\s*(\\S+\\s+){${this.state.word + 2}}`);
		console.log(regex);
		const following = this.state.text.replace(regex, '');
		return (
			<pre>
				{ following }
			</pre>
		);
	}

	update(timestamp) {
		// stop reading
		if (!this.state.reading) return;
		// set initial update
		if (!this.lastUpdate) this.lastUpdate = timestamp;
		const elapsed = timestamp - this.lastUpdate;
		if (elapsed > this.state.delay) {
			this.lastUpdate = timestamp;
			this.setState(prev => {
				const { word, words, baseInterval } = prev;
				const prevWord = words[word - 1] || '';
				const current = words[word + 1];
				const nextWord = words[word + 2];
				const delay = baseInterval + nextWord.length * 20;
				return {
					delay,
					prevWord,
					current,
					nextWord,
					word: word + 1
				}
			});
		}
		window.requestAnimationFrame(this.update);
	}

  render() {
    return (
      <div className="App">
				<Switch>
					<Route exact path='/' render={() => (
						<div>
							<button onClick={this.toggle}>{ this.state.buttonText }</button>
							<button onClick={this.bookmark}>Add Bookmark</button>
							<Link to={'/settings'}>Settings</Link>
							<Reader reading={this.state.reading}
								prevWord={this.state.prevWord}
								current={this.state.current}
								nextWord={this.state.nextWord}
							/>
							{!this.state.reading ? this.renderText() : ''}
						</div>
					)} />
					<Route exact path='/settings' render={() => (
						<div>
							<Link to={'/'}>Reader</Link>
							<Settings bookmarks={this.state.bookmarks}
								baseInterval={this.state.baseInterval}
								setBaseInterval={(e) => this.setState({ baseInterval: +e.target.value })}
								handleFileSelect={this.handleFileSelect}
								loadBookmark={this.loadBookmark}
							/>
						</div>
					)} />
				</Switch>
      </div>
    );
  }
}

export default App;
