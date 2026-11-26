# Empêche la mise en veille de Windows tant qu'un calcul du pilote tourne, puis remet le PC en veille quand c'est fini.
# Usage : powershell -ExecutionPolicy Bypass -File outils/garder_eveille.ps1 [-Attente 600] [-Inactivite 900] [-SansVeilleApres] [-Essai]
# Ne change aucun réglage : il demande seulement à Windows de rester éveillé (comme un lecteur vidéo), et la demande
# disparaît dès que ce script s'arrête. Fermer le capot met quand même en veille.
# Fin du calcul (26/11/2026, demande du joueur) : le 26/11, le PC est resté allumé 12 h après la fin du calcul, alors que
# ce script avait bien rendu la main (un autre programme bloquait la veille). Désormais, une fois le calcul fini, le
# script met lui-même le PC en veille dès que personne ne l'a touché (clavier, souris) depuis -Inactivite secondes
# (15 min par défaut, comme le réglage de Windows sur secteur). Si quelqu'un utilise le PC, il attend ; il abandonne au
# bout de -AbandonApres secondes (4 h) et laisse alors Windows décider. -SansVeilleApres : ne fait pas cette mise en
# veille. -Essai : écrit seulement ce qu'il ferait, sans mettre en veille.
param([string]$Motif = 'pilote_voies', [int]$Attente = 600, [int]$Inactivite = 900, [int]$AbandonApres = 14400,
      [switch]$SansVeilleApres, [switch]$Essai)

Add-Type -Namespace Sanctuaire -Name Veille -MemberDefinition @'
[System.Runtime.InteropServices.DllImport("kernel32.dll")]
public static extern uint SetThreadExecutionState(uint esFlags);
[System.Runtime.InteropServices.DllImport("powrprof.dll")]
public static extern bool SetSuspendState(bool hibernate, bool forceCritical, bool disableWakeEvent);
[System.Runtime.InteropServices.StructLayout(System.Runtime.InteropServices.LayoutKind.Sequential)]
public struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }
[System.Runtime.InteropServices.DllImport("user32.dll")]
public static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);
[System.Runtime.InteropServices.DllImport("kernel32.dll")]
public static extern uint GetTickCount();
'@
$ES_CONTINUOUS = [uint32]'0x80000000'
$ES_SYSTEM_REQUIRED = [uint32]'0x00000001'
function Write-Journal([string]$texte) { Write-Output "$(Get-Date -Format 'dd/MM HH:mm') $texte" }

function Test-Calcul {
  @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
    Where-Object { $_.CommandLine -and $_.CommandLine -match $Motif }).Count -gt 0
}
# Secondes depuis la dernière action au clavier ou à la souris.
function Get-Inactivite {
  $i = New-Object Sanctuaire.Veille+LASTINPUTINFO
  $i.cbSize = [System.Runtime.InteropServices.Marshal]::SizeOf($i)
  [void][Sanctuaire.Veille]::GetLastInputInfo([ref]$i)
  [int](([Sanctuaire.Veille]::GetTickCount() - $i.dwTime) / 1000)
}

[void][Sanctuaire.Veille]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)
Write-Journal "veille bloquée, en attente de la fin des calculs ($Motif)"
# Laisse $Attente secondes pour qu'un calcul démarre, puis tient tant qu'il en reste un.
$debut = Get-Date
while ((Test-Calcul) -or ((Get-Date) - $debut).TotalSeconds -lt $Attente) {
  Start-Sleep -Seconds 60
  [void][Sanctuaire.Veille]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)
}
[void][Sanctuaire.Veille]::SetThreadExecutionState($ES_CONTINUOUS)
Write-Journal 'plus aucun calcul : veille de nouveau permise'
if ($SansVeilleApres) { exit 0 }

# Mise en veille après le calcul, seulement si personne n'utilise le PC.
$fin = Get-Date
while (((Get-Date) - $fin).TotalSeconds -lt $AbandonApres) {
  if (Test-Calcul) { Write-Journal 'un nouveau calcul a démarré : pas de mise en veille'; exit 0 }
  $inactif = Get-Inactivite
  if ($inactif -ge $Inactivite) {
    if ($Essai) { Write-Journal "essai : personne depuis $([int]($inactif / 60)) min, le PC serait mis en veille"; exit 0 }
    Write-Journal "personne depuis $([int]($inactif / 60)) min : mise en veille"
    [void][Sanctuaire.Veille]::SetSuspendState($false, $false, $false)
    exit 0
  }
  Start-Sleep -Seconds ([Math]::Min(60, [Math]::Max(5, $Inactivite - $inactif)))
}
Write-Journal "le PC a été utilisé pendant $([int]($AbandonApres / 3600)) h après le calcul : la mise en veille est laissée à Windows"
