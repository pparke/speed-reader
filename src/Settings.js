import React, { Component } from 'react';
import './Settings.css';

const { createElement } = React;

class Settings extends Component {
	constructor(props) {
		super(props);

		this.renderBookmarks = this.renderBookmarks.bind(this);
	}

	renderBookmarks() {
		return this.props.bookmarks.map((bm, i) => <li key={i} onClick={() => this.props.loadBookmark(bm.word)}>{bm.word}. {bm.context}</li>)
	}

	render() {
		const numInput = createElement('input', {
			type: 'number',
			step: '10',
			min: '10',
			max: '500',
			value: this.props.baseInterval,
			onChange: this.props.setBaseInterval
		});

		return (
			<div className="settings">
				<input type="file" id="files" name="files[]" onChange={this.props.handleFileSelect} />
				{ numInput }
				<div className="bookmarks">
					<h3>Bookmarks</h3>
					<ul onClick={(e) => console.log(e.target)}>
						{ this.renderBookmarks() }
					</ul>
				</div>
			</div>
		);
	}
}

export default Settings;
