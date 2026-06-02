Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = 'C:\Users\Admin\Downloads\Bao cao du an Parkwave.docx'
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) 'docx_extract'
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $tempDir)
$xmlPath = Join-Path $tempDir 'word\document.xml'
[xml]$xml = Get-Content $xmlPath -Encoding UTF8
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$paragraphs = $xml.SelectNodes('//w:p', $ns)
$output = @()
foreach ($p in $paragraphs) {
    $text = ''
    $runs = $p.SelectNodes('.//w:r/w:t', $ns)
    foreach ($r in $runs) {
        $text += $r.InnerText
    }
    if ($text.Trim()) { $output += $text }
}
$outputPath = Join-Path $PSScriptRoot 'parkwave_content.txt'
$output | Out-File -FilePath $outputPath -Encoding UTF8
Write-Output "Done. Output saved to $outputPath"
Remove-Item $tempDir -Recurse -Force
