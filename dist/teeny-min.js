'use strict';(function(){var cache=Object.create(Object);window.teenyjs={};function buildModule(name){if(cache[name].data!==undefined){return;}
var args=[];cache[name].deps.forEach(function(dep){if(cache[dep].data===undefined){buildModule(dep);}
args.push(cache[dep].data);});cache[name].data=cache[name].moduleFunction.apply(undefined,args);};function areDependenciesLoaded(deps){for(var i=0;i<deps.length;++i){if(cache.hasOwnProperty(deps[i])===false||cache[deps[i]].data===undefined){return false;}}
return true;};window.teenyjs.require=function(names,scopedFunction){var args=[];names.forEach(function(name){if(cache.hasOwnProperty(name)){if(cache[name].data===undefined){buildModule(name);}
args.push(cache[name].data);}});scopedFunction.apply(undefined,args);};window.teenyjs.define=function(name,deps,moduleFunction){if(cache.hasOwnProperty(name)){throw'module '+name+' is already defined';}
cache[name]={deps:deps,moduleFunction:moduleFunction,data:undefined}
if(deps.length===0||areDependenciesLoaded(deps)===true){setTimeout(function(){buildModule(name);});}};})();