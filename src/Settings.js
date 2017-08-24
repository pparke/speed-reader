import React, { Component } from 'react';
import './Settings.css';

const { createElement } = React;

class Settings extends Component {

	renderBookmarks() {
		return this.props.bookmarks.map((bm, i) => <li key={i}>{bm}</li>)
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
				<ul onClick={(e) => console.log(e.target)}>
					{ this.renderBookmarks.bind(this) }
				</ul>
			</div>
		);
	}
}

export default Settings;
