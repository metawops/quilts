program test;

uses graph;

var
   grDriver, grMode, driver,
   maxX, maxY        : integer;
   maxCol            : word;


{$F+}
function autoDetect : integer;
begin
   autoDetect := 1;
end;
{$F-}

begin
   driver := InstallUserDriver('svga256', nil);
   writeln(driver);
   grDriver := driver;
   grMode := 0;

   initgraph(grDriver, grMode, 'c:\bp\bgi');

   maxX := GetMaxX;
   maxY := GetMaxY;
{   maxCol := GetMaxColor;}
   closegraph;
   writeln(maxX);
   writeln(maxY);
   writeln(maxCol);
   writeln(GraphErrorMsg(GraphResult));
   readln;
end.
