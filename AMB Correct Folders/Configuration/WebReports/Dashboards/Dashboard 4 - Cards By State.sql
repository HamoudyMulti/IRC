Select 
OTDBOwner.ValStr(ID,max(VerNum),1126878,6)as CState
from OTDBOwner.LLAttrData WITH (NOLOCK),OTDBOwner.DTree WITH (NOLOCK) WHERE DefID in (1126878) 
and DTree.DataID=LLAttrData.ID
and DTree.SubType=848
group by ID