Select 
OTDBOwner.ValStr(ID,max(VerNum),1126878,24)as CType,
OTDBOwner.ValStr(ID,max(VerNum),1126878,3)as CProductType
from OTDBOwner.LLAttrData WITH (NOLOCK),OTDBOwner.DTree WITH (NOLOCK) WHERE DefID in (1126878) 
and DTree.DataID=LLAttrData.ID
and DTree.SubType=848
group by ID