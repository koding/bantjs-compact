var compact = require('..');
var test = require('tape');

test('locals', function (t) {
  t.plan(1);

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

  var actual = compact(tree);
  var expected = 
      [ { name: 'q',
          locals:
           [ { name: 'z',
               locals:
                [ { name: 'y',
                    locals: [ { name: 'w', locals: [] } ] } ] },
             { name: 'c', locals: [] } ] },
        { name: 'b',
          locals:
           [ { name: 'a',
               locals:
                [ { name: 'w', locals: [] },
                  { name: 'j',
                    locals:
                     [ { name: 'w', locals: [] },
                       { name: 'd',
                         locals: [ { name: 'e', locals: [] } ] } ] } ] },
             { name: 'k',
               locals:
                [ { name: 'z',
                    locals:
                     [ { name: 'y',
                         locals: [ { name: 'w', locals: [] } ] } ] } ] } ] },
        { name: 'z',
          locals:
           [ { name: 'y',
               locals: [ { name: 'w', locals: [] } ] } ] },
        { name: 'x',
          locals:
           [ { name: 'y',
               locals: [ { name: 'w', locals: [] } ] },
             { name: 'j',
               locals:
                [ { name: 'w', locals: [] },
                  { name: 'd',
                    locals: [ { name: 'e', locals: [] } ] } ] },
             { name: 'c', locals: [] } ] },
        { name: 'y',
          locals: [ { name: 'w', locals: [] } ] },
        { name: 'j',
          locals:
           [ { name: 'w', locals: [] },
             { name: 'd',
               locals: [ { name: 'e', locals: [] } ] } ] },
        { name: 'w', locals: [] },
        { name: 'c', locals: [] } ];

  t.deepEqual(actual, expected);
});


