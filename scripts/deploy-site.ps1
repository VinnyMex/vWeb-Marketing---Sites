param (
    [Parameter(Mandatory=$true)]
    [string]$SiteId
)

$SitePath = "_sites/$SiteId"
$ProjectName = "vweb-$($SiteId.ToLower())"

if (-not (Test-Path $SitePath)) {
    Write-Error "Site folder not found: $SitePath"
    exit 1
}

Write-Host "Iniciando deploy isolado para: $SiteId"
Write-Host "Nome do projeto no Vercel: $ProjectName"

# O comando --yes e --prod automatizam a criação e o deploy de produção
# O vercel link associa a pasta a um projeto específico para evitar perguntas
cd $SitePath
vercel link --project $ProjectName --yes --scope "vmexrjs-projects"
vercel --prod --yes --scope "vmexrjs-projects"

Write-Host "Deploy concluído com sucesso!"
