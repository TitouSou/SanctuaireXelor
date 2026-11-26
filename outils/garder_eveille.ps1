# Empêche la mise en veille de Windows tant qu'un calcul du pilote tourne.
# Usage : powershell -ExecutionPolicy Bypass -File outils/garder_eveille.ps1
# Ne change aucun réglage : il demande seulement à Windows de rester éveillé (comme un lecteur vidéo),
# et la demande disparaît dès que ce script s'arrête. Fermer le capot met quand même en veille.
param([string]$Motif = 'pilote_voies', [int]$Attente = 600)

Add-Type -Namespace Sanctuaire -Name Veille -MemberDefinition @'
[System.Runtime.InteropServices.DllImport("kernel32.dll")]
public static extern uint SetThreadExecutionState(uint esFlags);
'@
$ES_CONTINUOUS = [uint32]'0x80000000'
$ES_SYSTEM_REQUIRED = [uint32]'0x00000001'

function Test-Calcul {
  @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
    Where-Object { $_.CommandLine -and $_.CommandLine -match $Motif }).Count -gt 0
}

[void][Sanctuaire.Veille]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)
Write-Output "$(Get-Date -Format 'dd/MM HH:mm') veille bloquée, en attente de la fin des calculs ($Motif)"
# Laisse $Attente secondes pour qu'un calcul démarre, puis tient tant qu'il en reste un.
$debut = Get-Date
while ((Test-Calcul) -or ((Get-Date) - $debut).TotalSeconds -lt $Attente) {
  Start-Sleep -Seconds 60
  [void][Sanctuaire.Veille]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)
}
[void][Sanctuaire.Veille]::SetThreadExecutionState($ES_CONTINUOUS)
Write-Output "$(Get-Date -Format 'dd/MM HH:mm') plus aucun calcul : veille de nouveau permise"
