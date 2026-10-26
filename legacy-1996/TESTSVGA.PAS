program testsvga;

uses graph, crt;

{$I svga256.inc}

var
   grDriver, grMode : integer;
   key              : char;
   x, y, size       : integer;



procedure loadPalette(filename: string);
var
   datei      : text;
   zeile      : string;
   r, g, b    : integer;
   err        : integer;
   p1, p2, p3 : integer;
   s1, s2     : string;
   index      : integer;

begin
   assign(datei, filename);
   reset(datei);

   index := 0;
   while not eof(datei) and not (index>255) do begin
      readln(datei, zeile);
{      writeln('gelesen:', zeile);}

      { rot-Wert holen: }
      p1 := 1;
      while (ord(zeile[p1]) < ord('0')) or
            (ord(zeile[p1]) > ord('9')) do
         inc(p1);

      p2 := p1;
      while (ord(zeile[p2]) >= ord('0')) and
            (ord(zeile[p2]) <= ord('9')) do
         inc(p2);

{      writeln('p1=', p1, ', p2=', p2);}
      s1 := copy(zeile, p1, p2-p1);
{      writeln('s1=', s1, '.');}
      val(s1, r, err);


      { grün-Wert holen: }
      p1 := p2;
      while (ord(zeile[p1]) < ord('0')) or
            (ord(zeile[p1]) > ord('9')) do
         inc(p1);

      p2 := p1;
      while (ord(zeile[p2]) >= ord('0')) and
            (ord(zeile[p2]) <= ord('9')) do
         inc(p2);

{      writeln('p1=', p1, ', p2=', p2);}
      s1 := copy(zeile, p1, p2-p1);
{      writeln('s1=', s1, '.');}
      val(s1, g, err);


      { blau-Wert holen: }
      p1 := p2;
      while (ord(zeile[p1]) < ord('0')) or
            (ord(zeile[p1]) > ord('9')) do
         inc(p1);

      p2 := p1;
      while (ord(zeile[p2]) >= ord('0')) and
            (ord(zeile[p2]) <= ord('9')) do
         inc(p2);

{      writeln('p1=', p1, ', p2=', p2);}
      s1 := copy(zeile, p1, p2-p1);
{      writeln('s1=', s1, '.');}
      val(s1, b, err);



{      writeln('red:', r, ', green:', g, ', blue:', b);
      readln;                                          }
      setRGBpalette(index, r div 4, g div 4, b div 4);
      inc(index);
   end;

   close(datei);
end;



begin
{
   writeln('------------------------------------------------------------');
   loadPalette('c:\fractint\chroma.map');
}
   grDriver := InstallUserDriver('svga256', nil);
   grMode := SVGA1024x768x256;
{   grMode := SVGA800x600x256;}
   initGraph(grDriver, grMode, 'c:\stefan\svgabgi');

   size := (GetMaxY+1) div 16;

   for x := 0 to 15 do begin
      for y := 0 to 15 do begin

         setFillStyle(SolidFill, x*16+y);
         bar(x*size, y*size, x*size+size-1, y*size+size-1);
{         setcolor(15);
         rectangle(x*48, y*48, x*48+47, y*48+47);}

      end;
   end;

   key := readkey;
{
   for x := 0 to 63 do
      setRGBpalette(x, x, 0, 0);
   for x := 64 to 127 do
      setRGBpalette(x, 0, x-64, 0);
   for x := 128 to 191 do
      setRGBpalette(x, 0, 0, x-128);
   for x := 192 to 255 do
      setRGBpalette(x, x-192, x-192, 255-x);

   key := readkey;
}
   loadPalette('c:\fractint\neon.map');

   key := readkey;
   closeGraph;
end.
