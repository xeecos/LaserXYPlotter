; -- Example1.iss --
; Demonstrates copying 3 files and creating an icon.

; SEE THE DOCUMENTATION FOR DETAILS ON CREATING .ISS SCRIPT FILES!

[Setup]
AppName=Laser Plotter
AppVersion=1.0.0
DefaultDirName={pf}\Laser Plotter
DefaultGroupName=Laser Plotter
UninstallDisplayIcon={app}\LaserPlotter.exe
Compression=lzma2
SolidCompression=yes
OutputDir=userdocs:LaserPlotter  
;ArchitecturesAllowed=x64
; "ArchitecturesInstallIn64BitMode=x64" requests that the install be
; done in "64-bit mode" on x64, meaning it should use the native
; 64-bit Program Files directory and the 64-bit view of the registry.
;ArchitecturesInstallIn64BitMode=x64

[Files]
Source: "build\LaserPlotter\win32\*"; DestDir: "{app}"; Flags:recursesubdirs

[Icons]
Name: "{userdesktop}\Laser Plotter"; Filename: "{app}\LaserPlotter.exe";WorkingDir: "{app}";
