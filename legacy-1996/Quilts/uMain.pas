unit uMain;

interface

uses
  Windows, Messages, SysUtils, Classes, Graphics, Controls, Forms, Dialogs,
  ComCtrls, Menus, ExtCtrls, StdCtrls, Buttons;

const
  quad = 0;
  hex  = 1;

type
  TQuiltParam = record
     lambda,
     alpha,
     beta,
     gamma,
     omega,
     shift,
     m1,
     m2     : extended;
  end;

  TfrmMain = class(TForm)
    menu: TMainMenu;
    mnFile: TMenuItem;
    mnFileExit: TMenuItem;
    mnOpt: TMenuItem;
    mnOptParamImg: TMenuItem;
    mnOptParamMath: TMenuItem;
    mnInfo: TMenuItem;
    mnInfoAbout: TMenuItem;
    status: TStatusBar;
    btGo: TBitBtn;
    paint: TPaintBox;
    procedure FormResize(Sender: TObject);
    procedure paintPaint(Sender: TObject);
    procedure mnOptParamImgClick(Sender: TObject);
    procedure mnFileExitClick(Sender: TObject);
    procedure mnOptParamMathClick(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private-Deklarationen }
  public
    { Public-Deklarationen }
    quiltParam : array[quad..hex]of TQuiltParam;
  end;

var
  frmMain: TfrmMain;

implementation

uses uImgPara, uMatPara;

{$R *.DFM}


procedure TfrmMain.FormResize(Sender: TObject);
begin
   paint.Top := 42;
   paint.Height := Height-106;
   paint.Width := Width-6;
   status.Top := Height-65;
end;

procedure TfrmMain.paintPaint(Sender: TObject);
begin
   paint.Canvas.Rectangle (0, 0, paint.Width, paint.Height);
   paint.Canvas.MoveTo (0, 0);
   paint.Canvas.LineTo (paint.Width-1, paint.Height-1);
end;

procedure TfrmMain.mnOptParamImgClick(Sender: TObject);
begin
   dlgImgParam.ShowModal;
end;

procedure TfrmMain.mnFileExitClick(Sender: TObject);
begin
   Close;
end;

procedure TfrmMain.mnOptParamMathClick(Sender: TObject);
var
   s: string;
begin
   with dlgMathParam do begin
      if rbQuad.Checked then begin
         str(quiltParam[quad].lambda:0:3, s);
         edLambda.Text := s;
         str(quiltParam[quad].alpha:0:3, s);
         edAlpha.Text := s;
         str(quiltParam[quad].beta:0:3, s);
         edBeta.Text := s;
         str(quiltParam[quad].gamma:0:3, s);
         edGamma.Text := s;
         str(quiltParam[quad].omega:0:3, s);
         edOmega.Text := s;
         str(quiltParam[quad].shift:0:3, s);
         edShift.Text := s;
         str(quiltParam[quad].m1:0:3, s);
         edM1.Text := s;
         str(quiltParam[quad].m2:0:3, s);
         edM2.Text := s;
      end
      else begin
         str(quiltParam[hex].lambda:0:3, s);
         edLambda.Text := s;
         str(quiltParam[hex].alpha:0:3, s);
         edAlpha.Text := s;
         str(quiltParam[hex].beta:0:3, s);
         edBeta.Text := s;
         str(quiltParam[hex].gamma:0:3, s);
         edGamma.Text := s;
         str(quiltParam[hex].omega:0:3, s);
         edOmega.Text := s;
         str(quiltParam[hex].shift:0:3, s);
         edShift.Text := s;
         str(quiltParam[hex].m1:0:3, s);
         edM1.Text := s;
         str(quiltParam[hex].m2:0:3, s);
         edM2.Text := s;
      end;
   end; { of with }
   dlgMathParam.ShowModal;
end;

procedure TfrmMain.FormCreate(Sender: TObject);
begin
  with quiltParam[quad] do begin
     { default values: abb2.6 }
     lambda := -0.59;
     alpha := 0.2;
     beta := 0.1;
     gamma := -0.33;
     omega := 0.0;
     shift := 0.5;
     m1 := 2.0;
     m2 := 0.0;
  end;
  with quiltParam[hex] do begin
     { default values: abb2.9 }
     lambda := 0.1;
     alpha := -0.076;
     beta := -0.06;
     gamma := 0.1;
     omega := 0.0;
     shift := 0.0; { not used! }
     m1 := 0.0;
     m2 := 0.0;
  end;
end;

end.
