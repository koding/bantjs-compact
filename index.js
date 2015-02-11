var toposort = require('toposort');

module.exports = function (tree) {
  return sort(tree.map(traverse.bind(null))).map(function (name) {
    return tree[find(tree, name, true)];
  }).reduce(function (a, b, i) {
    var arr = [].concat(a);
    if (distance(arr, b) !== 1)
      return arr.concat(b);
    return arr;
  });

  function traverse (branch) {
    branch.locals = [].concat(branch.locals)
      .filter(Boolean)
      .map(function (local) {
        if ('object' !== typeof local)
          local = find(tree, local);
        return traverse(local);
      }).filter(Boolean);
    return branch;
  }
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

function find (tree, name, indexOnly) {
  var ret;
  tree.some(function (branch, i) {
    return (branch.name == name) && (ret = indexOnly ? i : tree[i]);
  });
  return ret;
}

function distance (a, b) {
  var seen = [];
  return count(a, 0);

  function count (j, acc) {
    var i = 0;
    j.forEach(function (x) {
      if (!!~seen.indexOf(x.name)) return;
      seen.push(x.name);
      i += x.locals.filter(function (k) {
        return k.name === b.name;
      }).length;
      i += count(x.locals, acc);
    });
    return acc + i;
  }
}

