// User-approved Step 5 copy changes; preserve all other reference bytes/pixels.
module.exports=html=>html
 .replace('<summary title="Preview-only display settings">View</summary>','<summary title="Preview-only display settings">Preview settings</summary>')
 .replace('Preview only · never exported','Preview only — exports stay unchanged')
 .replace('Speaker volume (View, on the preview)','Speaker volume (Preview settings, on the preview)');
