unit Unit4;

interface

uses Windows, SysUtils, Classes, Graphics, Forms, Controls, StdCtrls, 
  Buttons, ExtCtrls, ComCtrls;

type
  TdlgImgParam = class(TForm)
    btOK: TButton;
    btCancel: TButton;
    GroupBox1: TGroupBox;
    tbSize: TTrackBar;
    lbSize: TLabel;
    RadioButton1: TRadioButton;
    RadioButton2: TRadioButton;
    RadioButton3: TRadioButton;
    RadioButton4: TRadioButton;
    RadioButton5: TRadioButton;
    RadioButton6: TRadioButton;
    RadioButton7: TRadioButton;
    RadioButton8: TRadioButton;
    RadioButton9: TRadioButton;
    RadioButton10: TRadioButton;
    RadioButton11: TRadioButton;
    RadioButton12: TRadioButton;
    RadioButton13: TRadioButton;
    RadioButton14: TRadioButton;
    RadioButton15: TRadioButton;
    procedure tbSizeChange(Sender: TObject);
    procedure RadioButton15Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  dlgImgParam: TdlgImgParam;

implementation

{$R *.DFM}

procedure TdlgImgParam.tbSizeChange(Sender: TObject);
begin
   lbSize.Caption := IntToStr(tbSize.Position);
end;

procedure TdlgImgParam.RadioButton15Click(Sender: TObject);
begin
   tbSize.Enabled := True;
end;

end.
