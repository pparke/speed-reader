import React from 'react';
import './Reader.css';

const Reader = ({ prevWord, current, nextWord }) => (
  <div className="Reader">
		<output id="list">
			<div className='words'>
				<span className='prev word'>{ prevWord }</span>&nbsp;&nbsp;
				<span className='current word'>{ current }</span>&nbsp;&nbsp;
				<span className='next word'>{ nextWord }</span>
			</div>
		</output>
  </div>
);

export default Reader;
