SELECT * FROM(Select
Dtree.CreateDate, 
OTDBOwner.ValStr(ID,max(VerNum),1126878,49)as 'Reference Number',
OTDBOwner.ValStr(ID,max(VerNum),1126878,29)as 'Card Number',
OTDBOwner.ValStr(ID,max(VerNum),1126878,26)as 'Delivery Status',
OTDBOwner.ValStr(ID,max(VerNum),1126878,24)as 'Card Type',
OTDBOwner.ValStr(ID,max(VerNum),1126878,6)as 'Card State',
OTDBOwner.ValStr(ID,max(VerNum),1126878,27)as 'Card Activated',
ID
from OTDBOwner.LLAttrData WITH (NOLOCK),OTDBOwner.DTree WITH (NOLOCK) WHERE DefID in (1126878)
and DTree.DataID=LLAttrData.ID
and DTree.SubType=848 and Name <> 'Card'
group by ID,DTree.CreateDate,DTree.CreatedBy

UNION ALL

Select 
Dtree.CreateDate,
OTDBOwner.ValStr(ID,max(VerNum),1293752,7)as 'Reference Number',
NULL AS 'Card Number',
OTDBOwner.ValStr(ID,max(VerNum),1293752,4)as 'Delivery Status',
NULL AS 'Card Type',
NULL AS 'Card State',
NULL as 'Card Activated',
ID
FROM OTDBOwner.LLAttrData WITH (NOLOCK),OTDBOwner.DTree WITH (NOLOCK) WHERE DefID in (1293752)
and DTree.DataID=LLAttrData.ID
and DTree.SubType=848 and Name <> 'PIN'
group by ID,DTree.CreateDate,DTree.CreatedBy) AS C


WHERE C.[Reference Number] LIKE N%1+'%'
and C.[Card Number] LIKE N%2+'%'
and C.[Delivery Status] LIKE N%3+'%'
and C.[Card Type] LIKE N%4+'%'
and C.[Card State] LIKE N%5+'%'
and C.[Card Activated] LIKE N%6+'%'
and C.[CreateDate] between %7 and %8+1 