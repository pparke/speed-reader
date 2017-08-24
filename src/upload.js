
export function checkCompat() {
	if (!window.File && window.FileReader && window.FileList && window.Blob) {
	  alert('The File APIs are not fully supported in this browser.');
	}
}

export function handleFileSelect(evt) {
  const files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  const output = [];
  for (let i = 0, f; f = files[i]; i++) {
    output.push(`<li><strong>${escape(f.name)}</strong> (${f.type || 'n/a'}) -
                ${f.size} bytes, last modified:
                ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'}
                </li>`);
  }
  document.getElementById('list').innerHTML = `<ul>${output.join('')}</ul>`;
}
