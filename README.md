# teenyjs
A simple 0-calorie javascript module story

# Install
```
bower install teenyjs --save
```

# Directions
```
Include teenyjs in your app before any modules you define.  Your modules can be included asynchronously.
```

# Define a module
```
teenyjs.define( 'module_name',  ['dependency1', 'dependency2'], function ( dependency1, dependency2 ) {
	
	return Object.create( Object ); //Create your module and return it

});
```

# Require a module
```
teenyjs.require( ['dependency1', 'dependency2'], function ( dependency1, dependency2 ) {
	
	//Logic

});
```