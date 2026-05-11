$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if (-not $mongoService) {
  Write-Host "MongoDB service not found."
  Write-Host "Install it with: winget install MongoDB.Server"
  exit 0
}

if ($mongoService.Status -ne "Running") {
  Write-Host "Starting MongoDB service..."
  Start-Service -Name "MongoDB"
  $mongoService.WaitForStatus("Running", "00:00:15")
}

Write-Host "MongoDB service is running."

$mongosh = Get-Command mongosh -ErrorAction SilentlyContinue
if (-not $mongosh) {
  Write-Host "mongosh is not installed or not on PATH."
  Write-Host "Install it with: winget install MongoDB.Shell"
  exit 0
}

& $mongosh.Source --eval @"
use threads
const existingUser = db.getUser("threads_admin");
if (!existingUser) {
  db.createUser({
    user: "threads_admin",
    pwd: "threads_admin_dev",
    roles: [
      { role: "readWrite", db: "threads" },
      { role: "dbAdmin", db: "threads" }
    ]
  });
  print("threads_admin created");
} else {
  print("threads_admin already exists");
}
"@

Write-Host "threads database checked and local admin user created if needed."
