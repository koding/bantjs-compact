var toposort = require('toposort');
var _inspect = require('util').inspect;
inspect = function () {
  for (var i = 0; i < arguments.length; i++) {
    console.log(_inspect(arguments[i], { depth: null, colors: true }));
  }
}

var tree = [
  { name: 'w' },
  { name: 'y', locals: [ 'w' ] },
  { name: 'e' },
  { name: 'q', locals: [ 'z', 'c' ] },
  { name: 'z', locals: [ 'y' ] },
  { name: 'b', locals: [ 'a', 'k' ] },
  { name: 'k', locals: [ 'z' ] },
  { name: 'j', locals: [ 'w', 'd' ] },
  { name: 'a', locals: [ 'w', 'j' ] },
  { name: 'x', locals: [ 'y', 'j', 'c' ] },
  { name: 'c' },
  { name: 'd', locals: [ 'e' ] }
];


compact(sanitize(tree));


function compact (tree) {
  tree = sort(sanitize(tree)).map(function (name) {
    return tree[find(name, true)];
  });

  tree = tree.reduce(function (a, b, i) {
    var dependents = [].concat(a).filter(function (n) {
      return find(b.name, false, n.locals);
    });
    if (dependents.length !== 1)
      b.standalone = true;
    else
      b.standalone = false;
    return [].concat(a, b);
  });

  inspect(tree);

}

function sort (tree) {
  var nodes = tree.map(function (branch) { return branch.name; });
  var edges = [];
  tree.forEach(function (branch) {
    branch.locals.forEach(function (local) {
      edges.push([branch.name, local.name]);
    });
  });
  return toposort.array(nodes, edges);
}

function find (name, b, obj) {
  var ret;
  (obj || tree).some(function (node, i) {
    return (node.name == name) && (ret = b ? i : tree[i]);
  });
  return ret;
}

// todo: 
//  - throw missing branch
//  - throw circular
function sanitize (tree) {
  return tree.map(traverse.bind(null));

  function traverse (branch) {
    branch.locals = [].concat(branch.locals)
      .filter(Boolean)
      .map(function (local) {
        if ('object' !== typeof local)
          local = find(local);
        return traverse(local);
      }).filter(Boolean);
    return branch;
  }
}
