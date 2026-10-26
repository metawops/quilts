unit uMatPara;

interface

uses Windows, SysUtils, Classes, Graphics, Forms, Controls, StdCtrls,
  Buttons, ComCtrls, ExtCtrls;

type
  TdlgMathParam = class(TForm)
    Panel1: TPanel;
    Panel2: TPanel;
    OKBtn: TButton;
    CancelBtn: TButton;
    PageControl1: TPageControl;
    tsQuilts: TTabSheet;
    GroupBox1: TGroupBox;
    rbQuad: TRadioButton;
    rbHex: TRadioButton;
    Label1: TLabel;
    GroupBox2: TGroupBox;
    Label2: TLabel;
    edLambda: TEdit;
    edAlpha: TEdit;
    Label3: TLabel;
    edBeta: TEdit;
    Label4: TLabel;
    edGamma: TEdit;
    Label5: TLabel;
    edOmega: TEdit;
    Label6: TLabel;
    edShift: TEdit;
    Label7: TLabel;
    Label8: TLabel;
    edM1: TEdit;
    Label9: TLabel;
    edM2: TEdit;
    Label10: TLabel;
    Label11: TLabel;
    procedure rbHexClick(Sender: TObject);
    procedure rbQuadClick(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  dlgMathParam: TdlgMathParam;

implementation

{$R *.DFM}

procedure TdlgMathParam.rbHexClick(Sender: TObject);
begin
   edShift.Visible := False;
   Label7.Visible := False;
   GroupBox2.Caption := ' Parameters for hexagonal Quilts: ';
end;

procedure TdlgMathParam.rbQuadClick(Sender: TObject);
begin
   edShift.Visible := True;
   Label7.Visible := True;
   GroupBox2.Caption := ' Parameters for quadratic Quilts: ';
end;

end.

