'use strict';
( function () {

	//Modules as properties
	var cache = Object.create( Object );

	//Global reference to our module
	window.teenyjs = {};

	/**
	 * Resolves a module and it's dependencies
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	function buildModule( name ) {

		// Since we begin loading from the event queue it's possible to hit this more than once, just exit if you do
		if ( cache[name].data !== undefined ) {

			return;

		}

		var args = [];

		//Build all the dependencies too
		cache[name].deps.forEach( function ( dep ) {

			if ( cache[dep].data === undefined ) {

				buildModule( dep );

			}

			args.push( cache[dep].data );

		});

		//It's ready, build the module
		cache[name].data = cache[name].moduleFunction.apply( undefined, args );

	};

	/**
	 * Checks if the dependencies are loaded
	 * @param  {[type]} deps [description]
	 * @return {[type]}      [description]
	 */
	function areDependenciesLoaded ( deps ) {

		for ( var i = 0; i < deps.length; ++i ) {

			//This is blowing the stack by recursively checking data on load, for now we'll just make sure any
			//modules we load from the get go have all dependecies completely built
			if ( cache.hasOwnProperty( deps[i] ) === false || cache[deps[i]].data === undefined ) {

				return false;

			}

		}

		return true;

	};

	/**
	 * Sets the module and applies it to the supplied function
	 * @param  {[type]} names          [description]
	 * @param  {[type]} scopedFunction [description]
	 * @return {[type]}                [description]
	 */
	window.teenyjs.require = function ( names, scopedFunction ) {

		var args = [];
		var promises = [];

		//Load the promises
		try {

			names.forEach( function ( name ) {

				//Load any unloaded module asynchronously with a promise
				promises.push( new Promise( function ( resolve, reject ) {

					if ( cache.hasOwnProperty( name ) ) {

						resolve( function () {

							//If this hasn't been set, set it now
							if  ( cache[name].data === undefined ) {

								buildModule( name );

							}

						}() );

					} else {

						reject( 'Module ' + name + ' doesn\'t exist' );

					}

				}));

			});

			//All the dependencies are in promises, resolve them
			Promise.all( promises ).then( function () {

				names.forEach( function ( name ) {

					args.push( cache[name].data );

				});

				//Execute the scoped function with the provided dependencies
				scopedFunction.apply( undefined, args );

			}, function ( e ) {

					throw e;

			});

		} catch ( e ) {

			//Assume promises failed and we are in ie
			promises = [];

			//We will load synchronously
			names.forEach( function ( name ) {

				if ( cache.hasOwnProperty( name ) ) {

					buildModule( name );

					args.push( cache[name].data );

				}

			});

			scopedFunction.apply( undefined, args );

		}

	};

	/**
	 * Gets the function to create the module ready
	 * @param  {[type]} name           [description]
	 * @param  {[type]} moduleFunction [description]
	 * @return {[type]}                [description]
	 */
	window.teenyjs.define = function ( name, deps, moduleFunction ) {

		if ( cache.hasOwnProperty( name ) ) {

			throw 'module ' + name + ' is already defined';

		}

		cache[name] = {

			deps: deps,
			moduleFunction: moduleFunction,
			data: undefined

		}

		//If there are no hindrances throw this on the event queue to build
		if ( deps.length === 0 || areDependenciesLoaded( deps ) === true ) {

			setTimeout( function () {

				buildModule( name );

			});

		}

	};

})();