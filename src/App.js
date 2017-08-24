import React, { Component } from 'react';
import './App.css';
import Reader from './Reader';
import Settings from './Settings';
import { Switch, Route, Link } from 'react-router-dom';

const { createElement } = React;

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			baseInterval: 150,
			delay: 200,
			reading: false,
			buttonText: 'Begin',
			prevWord: 'the',
			current: 'start',
			nextWord: ':)',
			info: '',
			text: '',
			words: [],
			word: 0,
			bookmarks: []
		};

		this.lastUpdate = 0;

		this.checkCompat = this.checkCompat.bind(this);
		this.handleFileSelect = this.handleFileSelect.bind(this);
		this.displayContents = this.displayContents.bind(this);
		this.toggle = this.toggle.bind(this);
		this.update = this.update.bind(this);
		this.bookmark = this.bookmark.bind(this);
	}

	componentDidMount() {
		if (this.checkCompat()) {
			this.reader = new FileReader();
			this.reader.onload = this.displayContents;
		}
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
			const bookmarks = prev.bookmarks.slice();
			bookmarks.push(prev.word);
			console.log('bookmark added', bookmarks)
			return {
				bookmarks
			}
		});
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
				const prevWord = prev.words[prev.word - 1] || '';
				const current = prev.words[prev.word + 1];
				const nextWord = prev.words[prev.word + 2];
				const delay = prev.baseInterval + nextWord.length * 20;
				return {
					delay,
					prevWord,
					current,
					nextWord,
					word: prev.word + 1
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
						</div>
					)} />
					<Route exact path='/settings' render={() => (
						<div>
							<Link to={'/'}>Reader</Link>
							<Settings bookmarks={this.state.bookmarks}
												baseInterval={this.state.baseInterval}
												setBaseInterval={(e) => this.setState({ baseInterval: +e.target.value })}
												handleFileSelect={this.handleFileSelect}
							/>
							<pre>
								{ this.state.text }
							</pre>
						</div>
					)} />
				</Switch>
      </div>
    );
  }
}

export default App;
