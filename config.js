module.exports = {

	// The rule path. 
	// Here we're using the Apache pattern for serving user home dir
	// Example: http://myserver.com/~myusername
	mainRoute: '/~:user',

	// The path to serve.
	// Rosie will replace the pattern {{user}} with the route without the tilde (/~)
	// Here, the mounted path should be /home/myusername/public_html
	path: '/home/{{user}}/public_html',

	// Server static options	
	serverStatic: {

		// You can get more details here: https://github.com/expressjs/serve-static
		options: {

			// Set how "dotfiles" are treated when encountered.
			// Avaialble options: allow, deny, ignore
			dotfiles: 'ignore',

			// Enable or disable etag generation, defaults to true.
			etag: true,

			// Set file extension fallbacks.
			// The first that exists will be served. Example: ['html', 'htm']
			extensions: false,

			// You can pass a string or an array.
			// Example: ['index.html', 'index.htm']
			index: false,

			// Enable or disable Last-Modified header, defaults to true.
			// Uses the file system's last modified value.
			lastModified: true,

			// Provide a max-age in milliseconds for http caching, defaults to 0.
			// This can also be a string accepted by the ms module.
			maxAge: 0,

			// Redirect to trailing "/" when the pathname is a dir.
			redirect: true,

			// Function to set custom headers on response.
			// The function is called as fn(res, path, stat)
			setHeaders: null
		}
	},

	// Server index options
	serverIndex: {

		// You can get more details here: https://github.com/expressjs/serve-index
		options: {

			// Apply this filter function to files.
			// The filter function is called for each file.
			// Signature: filter(filename, index, files, dir)
			filter: false,

			// Display hidden (dot) files.
			hidden: false,

			// Display icons.
			icons: true,

			// Optional path to a CSS stylesheet.
			stylesheet: null,

			// Optional path to an HTML template.
			// Avaialable tokens:  {directory}, {files}, {linked-path}, {style}
			template: null,

			// Display mode.
			// Avaialble options: 'tiles' and 'details'
			view: 'tiles'
		}
	}
}