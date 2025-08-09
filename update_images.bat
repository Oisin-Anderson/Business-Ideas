@echo off
echo Updating images for variety...

powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1441986300917-64674bd600d8', 'photo-1568901346375-23c9450c58cd' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1559757148-5c350d0d3c56', 'photo-1495474472287-4d71bcdd2085' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1544191696-102dbdaeeaa5', 'photo-1509042239860-f550ce710b93' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1560518883-ce09059eeffa', 'photo-1541961017774-22349e4a1262' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1450778869180-41d0601e046e', 'photo-1548199973-03cce0bbc87b' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1551288049-bebda4e38f71', 'photo-1517248135467-4c7edcad34c4' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1517248135467-4c7edcad34c4', 'photo-1576091160399-112ba8d25d1f' | Set-Content businessIdeas.js"
powershell -Command "(Get-Content businessIdeas.js) -replace 'photo-1558618666-fcd25c85cd64', 'photo-1587300003388-59208cc962cb' | Set-Content businessIdeas.js"

echo Images updated successfully! 