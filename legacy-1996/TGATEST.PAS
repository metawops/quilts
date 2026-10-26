program TGAtest;

var dat : file of byte;
    x,y : integer;


procedure writeVal(value: byte);
begin
   write(dat, value);
end;


begin
   assign(dat, 'test.tga');
   rewrite(dat);

   writeVal($00);  { number of characters in identification field   }

   writeVal($01);  { color map type; 1 for this kind of Targa files }
                   { (uncompressed, color-mapped images)            }

   writeVal($01);  { Image Type code; always 1 for this image type  }

                   { COLOR MAP SPECIFICATION:                       }
   writeVal($00);  { color map origin, lo-hi order }
   writeVal($00);

   writeVal($04);  { color map length, lo-hi order }
   writeVal($00);

   writeVal(24);   { color map entry size; 24=3*8: 8 bits for each }
                   { red, green and blue                           }

                   { IMAGE SPECIFICATION:                          }
   writeVal($00);  { x origin of image, (lower left corner), lo-hi }
   writeVal($00);
   writeVal($00);  { y origin of image, (lower left corner), lo-hi }
   writeVal($00);
   writeVal($09);  { width, lo-hi }
   writeVal($00);
   writeVal($09);  { height, lo-hi }
   writeVal($00);
   writeVal($08);  { image pixel size, 8 bit per color component   }
   writeVal($00);  { image descriptor byte; always 0?              }

   { no image identification field... (see first written byte above!) }

   { COLOR MAP DATA:                                                  }
   { list of 3 byte entries, ordered blue, green, red!                }
   { for the number of this 3-byte-lists see color map length above!  }

   { 1st color in colormap: black: }
   writeVal($00); { no   blue  part }
   writeVal($00); { no   green part }
   writeVal($00); { full red   part }

   { 2nd color in colormap: pure red: }
   writeVal($00); { no   blue  part }
   writeVal($00); { no   green part }
   writeVal($FF); { full red   part }

   { 3rd color in colormap: pure green: }
   writeVal($00); { no   blue  part }
   writeVal($FF); { full green part }
   writeVal($00); { no   red   part }

   { 4th color in colormap: pure blue: }
   writeVal($FF); { full blue  part }
   writeVal($00); { no   green part }
   writeVal($00); { no   red   part }


   { IMAGE DATA FIELD:                                                  }
   { This field specifies (width) x (height) color map indices. Each    }
   { index is stored as an integral number of bytes (typically 1 or 2). }
   { All fields are unsigned. The low-order byte of a two-byte field is }
   { stored first.                                                      }

   { remember: bottom to top format! }
   { three full-width lines of index 0 (red): }
   for y := 1 to 3 do
      for x := 1 to 9 do
        writeVal($01);

   { three full-width lines of index 1 (green): }
   for y := 1 to 3 do
      for x := 1 to 9 do
        writeVal($02);

   { three full-width lines of index 2 (blue): }
   for y := 1 to 3 do
      for x := 1 to 9 do
        writeVal($03);


   close(dat);
end.
