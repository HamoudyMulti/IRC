select * from (Select ID,
OTDBOwner.ValStr(ID,max(VerNum),1293752,7)as 'Reference_Number',
OTDBOwner.ValStr(ID,max(VerNum),1293752,4)as 'Delivery_Status'
from OTDBOwner.LLAttrData WITH (NOLOCK),OTDBOwner.DTree WITH (NOLOCK) WHERE DefID in (1293752)
and DTree.DataID=LLAttrData.ID
and DTree.SubType=848
group by ID
) as L
where L.Reference_Number=%1