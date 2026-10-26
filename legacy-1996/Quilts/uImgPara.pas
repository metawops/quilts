unit uImgPara;

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
    rb16: TRadioButton;
    rb32: TRadioButton;
    rb50: TRadioButton;
    rb64: TRadioButton;
    rb100: TRadioButton;
    rb128: TRadioButton;
    rb200: TRadioButton;
    rb240: TRadioButton;
    rb256: TRadioButton;
    rb480: TRadioButton;
    rb512: TRadioButton;
    rb600: TRadioButton;
    rb768: TRadioButton;
    rb1024: TRadioButton;
    rbCustom: TRadioButton;
    procedure tbSizeChange(Sender: TObject);
    procedure rbCustomClick(Sender: TObject);
    procedure rb16Click(Sender: TObject);
    procedure rb32Click(Sender: TObject);
    procedure rb50Click(Sender: TObject);
    procedure rb64Click(Sender: TObject);
    procedure rb100Click(Sender: TObject);
    procedure rb128Click(Sender: TObject);
    procedure rb200Click(Sender: TObject);
    procedure rb240Click(Sender: TObject);
    procedure rb256Click(Sender: TObject);
    procedure rb480Click(Sender: TObject);
    procedure rb512Click(Sender: TObject);
    procedure rb600Click(Sender: TObject);
    procedure rb768Click(Sender: TObject);
    procedure rb1024Click(Sender: TObject);
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

procedure TdlgImgParam.rbCustomClick(Sender: TObject);
begin
   tbSize.Enabled := True;
end;

procedure TdlgImgParam.rb16Click(Sender: TObject);
begin
   tbSize.Enabled := False;
end;

procedure TdlgImgParam.rb32Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb50Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb64Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb100Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb128Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb200Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb240Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb256Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb480Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb512Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb600Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb768Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

procedure TdlgImgParam.rb1024Click(Sender: TObject);
begin
   tbSize.Enabled := False;

end;

end.
