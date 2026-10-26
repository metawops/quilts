uses crt;
var k1, k2: char;
begin
  repeat
     k1 := readkey;
     writeln('k1:',k1,':(',ord(k1),')');
     if k1=#0 then begin
       k2 := readkey;
       writeln('  k2:',k2,':(',ord(k2),')');
     end;
  until k1=#27;
end.