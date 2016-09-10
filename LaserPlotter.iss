; -- Example1.iss --
; Demonstrates copying 3 files and creating an icon.

; SEE THE DOCUMENTATION FOR DETAILS ON CREATING .ISS SCRIPT FILES!

[Setup]
AppName=Laser Plotter
AppVersion=1.0.4
DefaultDirName={pf}\Laser Plotter
DefaultGroupName=Laser Plotter
UninstallDisplayIcon={app}\Laser Plotter.exe
Compression=lzma2
SolidCompression=yes
OutputDir=userdocs:LaserXYPlotter  
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Files]
Source: "build\Laser Plotter\win64\*"; DestDir: "{app}"; Flags:recursesubdirs

[Icons]
Name: "{userdesktop}\Laser Plotter"; Filename: "{app}\Laser Plotter.exe";WorkingDir: "{app}";
