function loadPalette(filename: string) : integer;
var
   datei      : text;
   zeile      : string;
   r, g, b    : integer;
   err        : integer;
   p1, p2, p3 : integer;
   s1, s2     : string;
   index      : integer;

begin
   {$I-}
   assign(datei, filename);
   reset(datei);
   {$I+}
   if IOResult=0 then begin

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

      loadPalette := 0;
   end
   else
      loadPalette := -1;
   close(datei);
end;

